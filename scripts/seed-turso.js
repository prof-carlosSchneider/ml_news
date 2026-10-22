const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { getDb, initDb } = require("../lib/db");

async function seed() {
  console.log("--------------------------------------------------");
  console.log("Iniciando migração / seed de dados para o Turso...");
  console.log("--------------------------------------------------");

  const dbUrl = process.env.TURSO_DATABASE_URL || "(banco SQLite local em dados/local.db)";
  console.log(`Conectando ao banco: ${dbUrl}`);

  const db = getDb();
  await initDb();
  console.log("✔ Tabelas verificadas/criadas com sucesso.");

  const dadosDir = path.join(__dirname, "..", "dados");

  // 1. Migrar conteudo.json
  const contentFile = path.join(dadosDir, "conteudo.json");
  if (fs.existsSync(contentFile)) {
    try {
      const content = JSON.parse(fs.readFileSync(contentFile, "utf8"));
      await db.execute({
        sql: `INSERT INTO portal_content (id, data, updated_at)
              VALUES ('current', ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`,
        args: [JSON.stringify(content)]
      });
      console.log("✔ Conteúdo do portal (conteudo.json) migrado com sucesso.");
    } catch (err) {
      console.error("✖ Erro ao migrar conteudo.json:", err.message);
    }
  }

  // 2. Migrar jogos.json
  const gamesFile = path.join(dadosDir, "jogos.json");
  if (fs.existsSync(gamesFile)) {
    try {
      const games = JSON.parse(fs.readFileSync(gamesFile, "utf8"));
      for (const game of games) {
        if (game.url && game.url.includes("http://localhost:5500")) {
          game.url = game.url.replace("http://localhost:5500", "");
        }
        const plays = Number.isFinite(game.plays) ? game.plays : 0;
        await db.execute({
          sql: `INSERT INTO games (id, title, plays, data, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET title = excluded.title, plays = excluded.plays, data = excluded.data`,
          args: [String(game.id), String(game.title || "Sem título"), plays, JSON.stringify(game)]
        });
      }
      console.log(`✔ Catálogo de jogos (${games.length} jogos) migrado com sucesso.`);
    } catch (err) {
      console.error("✖ Erro ao migrar jogos.json:", err.message);
    }
  }

  // 3. Migrar logs-de-alteracoes.json
  const auditFile = path.join(dadosDir, "logs-de-alteracoes.json");
  if (fs.existsSync(auditFile)) {
    try {
      const logs = JSON.parse(fs.readFileSync(auditFile, "utf8"));
      let count = 0;
      for (const log of logs.slice(0, 100)) {
        await db.execute({
          sql: `INSERT INTO audit_logs (id, at, area, summary, changes_json, images_json)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO NOTHING`,
          args: [
            log.id,
            log.at || new Date().toISOString(),
            log.area || "Geral",
            log.summary || "",
            JSON.stringify(log.changes || []),
            JSON.stringify(log.images || [])
          ]
        });
        count++;
      }
      console.log(`✔ Histórico de auditoria (${count} registros) migrado com sucesso.`);
    } catch (err) {
      console.error("✖ Erro ao migrar logs de alteração:", err.message);
    }
  }

  // 4. Migrar imagens da pasta imagens/uploads para a tabela uploads
  const uploadsDir = path.join(__dirname, "..", "imagens", "uploads");
  if (fs.existsSync(uploadsDir)) {
    try {
      const files = fs.readdirSync(uploadsDir).filter(f => !fs.statSync(path.join(uploadsDir, f)).isDirectory());
      let imgCount = 0;
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const ext = path.extname(file).toLowerCase();
        const mimeMap = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".gif": "image/gif",
          ".svg": "image/svg+xml"
        };
        const mimeType = mimeMap[ext] || "image/jpeg";
        const base64 = fs.readFileSync(filePath).toString("base64");

        await db.execute({
          sql: `INSERT INTO uploads (id, filename, mime_type, data_base64, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO NOTHING`,
          args: [file, file, mimeType, base64]
        });
        imgCount++;
      }
      console.log(`✔ Imagens existentes (${imgCount} arquivos) sincronizadas com o banco.`);
    } catch (err) {
      console.error("✖ Erro ao sincronizar imagens:", err.message);
    }
  }

  console.log("--------------------------------------------------");
  console.log("Migração concluída com sucesso!");
  console.log("--------------------------------------------------");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Falha fatal na migração:", err);
    process.exit(1);
  });
