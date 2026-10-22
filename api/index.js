const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const { getDb, initDb } = require("../lib/db");
const { contentChanges, gameChanges } = require("../lib/audit");

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

const adminPassword = process.env.ADMIN_PASSWORD || "@mlnews1";
const jwtSecret = process.env.JWT_SECRET || "mlnews_super_secret_jwt_key_2026_change_in_production";

function safeName(value) {
  return String(value || "arquivo").replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
}

function imageExtension(fileName, contentType) {
  const extension = path.extname(fileName || "").toLowerCase();
  const mediaExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".mp4", ".webm", ".ogg", ".mov"];
  if (mediaExtensions.includes(extension)) return extension;
  return ({
    "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
    "image/svg+xml": ".svg", "image/webp": ".webp", "video/mp4": ".mp4",
    "video/webm": ".webm", "video/ogg": ".ogg", "video/quicktime": ".mov"
  })[contentType] || ".jpg";
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "Sua sessão administrativa expirou. Entre novamente." });
  }
  try {
    jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: "Sua sessão administrativa expirou. Entre novamente." });
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

const router = express.Router();

// 1. Login
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (username !== "admin" || password !== adminPassword) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }
    const token = jwt.sign({ user: "admin" }, jwtSecret, { expiresIn: "30d" });
    return res.status(200).json({ token });
  } catch {
    return res.status(400).json({ error: "Não foi possível processar o acesso." });
  }
});

// 2. Content
router.get("/content", async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    const result = await db.execute({
      sql: "SELECT data FROM portal_content WHERE id = 'current'",
      args: []
    });
    if (result.rows.length > 0) {
      return res.status(200).json({ data: JSON.parse(result.rows[0].data) });
    }
    const fallbackPath = path.join(__dirname, "..", "dados", "conteudo.json");
    if (fs.existsSync(fallbackPath)) {
      const fallback = JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
      return res.status(200).json({ data: fallback });
    }
    return res.status(200).json({ data: null });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/content", requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.data || typeof payload.data !== "object") {
      return res.status(400).json({ error: "Conteúdo inválido." });
    }
    const db = getDb();
    await initDb();

    const existing = await db.execute({
      sql: "SELECT data FROM portal_content WHERE id = 'current'",
      args: []
    });
    const before = existing.rows.length ? JSON.parse(existing.rows[0].data) : null;
    const changes = contentChanges(before || {}, payload.data);

    await db.execute({
      sql: `INSERT INTO portal_content (id, data, updated_at)
            VALUES ('current', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`,
      args: [JSON.stringify(payload.data)]
    });

    if (changes.length > 0) {
      const images = [...new Set(changes.flatMap((change) => change.images || []))].slice(0, 6);
      await db.execute({
        sql: `INSERT INTO audit_logs (id, at, area, summary, changes_json, images_json)
              VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          "Portal",
          `${changes.length} ${changes.length === 1 ? "alteração" : "alterações"} em portal`,
          JSON.stringify(changes.slice(0, 80)),
          JSON.stringify(images)
        ]
      });
    }

    return res.status(200).json({ data: payload.data, changes: changes.length });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Não foi possível salvar o conteúdo." });
  }
});

// 3. Games
router.get("/games", async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    const result = await db.execute({
      sql: "SELECT id, plays, data FROM games ORDER BY updated_at DESC",
      args: []
    });
    if (result.rows.length > 0) {
      const games = result.rows.map(row => {
        const parsed = JSON.parse(row.data);
        parsed.plays = Number(row.plays) || 0;
        parsed.id = row.id;
        return parsed;
      });
      return res.status(200).json({ games });
    }
    const fallbackPath = path.join(__dirname, "..", "dados", "jogos.json");
    if (fs.existsSync(fallbackPath)) {
      const fallback = JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
      return res.status(200).json({ games: fallback });
    }
    return res.status(200).json({ games: [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/games", requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    if (!Array.isArray(payload.games)) {
      return res.status(400).json({ error: "Catálogo de jogos inválido." });
    }
    const db = getDb();
    await initDb();

    const currentResult = await db.execute({
      sql: "SELECT id, plays, data FROM games",
      args: []
    });
    const beforeGames = currentResult.rows.map(r => {
      const p = JSON.parse(r.data);
      p.plays = Number(r.plays) || 0;
      return p;
    });

    const updatedGames = payload.games.map((g) => ({
      ...g,
      id: g.id || crypto.randomUUID()
    }));
    const changes = gameChanges(beforeGames, updatedGames);

    const newIds = new Set(updatedGames.map(g => String(g.id)));
    for (const old of beforeGames) {
      if (!newIds.has(String(old.id))) {
        await db.execute({ sql: "DELETE FROM games WHERE id = ?", args: [String(old.id)] });
      }
    }

    for (const game of updatedGames) {
      const plays = Number.isFinite(game.plays) ? game.plays : 0;
      await db.execute({
        sql: `INSERT INTO games (id, title, plays, data, updated_at)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET title = excluded.title, plays = excluded.plays, data = excluded.data, updated_at = CURRENT_TIMESTAMP`,
        args: [String(game.id), String(game.title || "Sem título"), plays, JSON.stringify(game)]
      });
    }

    if (changes.length > 0) {
      await db.execute({
        sql: `INSERT INTO audit_logs (id, at, area, summary, changes_json, images_json)
              VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          "Jogos",
          `${changes.length} ${changes.length === 1 ? "alteração" : "alterações"} em jogos`,
          JSON.stringify(changes.slice(0, 80)),
          JSON.stringify([])
        ]
      });
    }

    return res.status(200).json({ games: updatedGames, changes: changes.length });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Não foi possível salvar os jogos." });
  }
});

// 4. Play Counter
router.post("/games/:id/play", async (req, res) => {
  try {
    const gameId = req.params.id;
    const db = getDb();
    await initDb();

    await db.execute({
      sql: "UPDATE games SET plays = plays + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [gameId]
    });

    const result = await db.execute({
      sql: "SELECT plays FROM games WHERE id = ?",
      args: [gameId]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jogo não encontrado." });
    }

    const plays = Number(result.rows[0].plays);
    return res.status(200).json({ plays });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Não foi possível registrar a partida." });
  }
});

// 5. Uploads
router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file || !file.buffer || !/^(image|video)\//.test(file.mimetype)) {
      return res.status(400).json({ error: "Envie uma imagem ou vídeo válido." });
    }
    const db = getDb();
    await initDb();

    const field = req.body.field || "foto";
    const extension = imageExtension(file.originalname, file.mimetype);
    const id = `${safeName(field)}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;

    await db.execute({
      sql: `INSERT INTO uploads (id, filename, mime_type, data_base64, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [id, file.originalname || id, file.mimetype, file.buffer.toString("base64")]
    });

    return res.status(200).json({ source: `/api/uploads/${id}` });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Falha no envio da imagem." });
  }
});

router.get("/uploads/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = getDb();
    await initDb();

    const result = await db.execute({
      sql: "SELECT filename, mime_type, data_base64 FROM uploads WHERE id = ?",
      args: [id]
    });

    if (result.rows.length > 0) {
      const row = result.rows[0];
      const buffer = Buffer.from(row.data_base64, "base64");
      res.setHeader("Content-Type", row.mime_type || "image/jpeg");
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.end(buffer);
    }

    const localPath = path.join(__dirname, "..", "imagens", "uploads", id);
    if (fs.existsSync(localPath)) {
      const ext = path.extname(localPath).toLowerCase();
      const mime = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml"
      }[ext] || "image/jpeg";
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return fs.createReadStream(localPath).pipe(res);
    }

    return res.status(404).json({ error: "Arquivo não encontrado." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 6. Contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Preencha todos os campos da mensagem." });
    }
    const db = getDb();
    await initDb();
    const id = crypto.randomUUID();
    const submittedAt = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO contact_messages (id, name, email, message, submitted_at) VALUES (?, ?, ?, ?, ?)`,
      args: [id, String(name).slice(0, 120), String(email).slice(0, 180), String(message).slice(0, 5000), submittedAt]
    });
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(400).json({ error: "Não foi possível enviar a mensagem." });
  }
});

router.get("/contact", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    const result = await db.execute({
      sql: "SELECT id, name, email, message, submitted_at as submittedAt FROM contact_messages ORDER BY submitted_at DESC LIMIT 500",
      args: []
    });
    return res.status(200).json({ messages: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/contact", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    const countRes = await db.execute({ sql: "SELECT COUNT(*) as total FROM contact_messages", args: [] });
    const count = countRes.rows[0]?.total || 0;
    await db.execute({ sql: "DELETE FROM contact_messages", args: [] });
    await db.execute({
      sql: `INSERT INTO audit_logs (id, at, area, summary, changes_json, images_json) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        "Mensagens",
        "Limpeza da caixa de mensagens",
        JSON.stringify([{ field: "Caixa de mensagens", before: `${count} registro(s)`, after: "Todos os registros foram removidos", images: [] }]),
        JSON.stringify([])
      ]
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 7. Audit
router.get("/audit", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    const result = await db.execute({
      sql: "SELECT id, at, area, summary, changes_json, images_json FROM audit_logs ORDER BY at DESC LIMIT 300",
      args: []
    });
    const logs = result.rows.map(row => ({
      id: row.id,
      at: row.at,
      area: row.area,
      summary: row.summary,
      changes: row.changes_json ? JSON.parse(row.changes_json) : [],
      images: row.images_json ? JSON.parse(row.images_json) : []
    }));
    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/audit", requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await initDb();
    await db.execute({ sql: "DELETE FROM audit_logs", args: [] });
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use("/api", router);
app.use("/", router);

module.exports = app;
