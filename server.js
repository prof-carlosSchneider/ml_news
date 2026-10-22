const path = require("path");
const express = require("express");
require("dotenv").config();

const app = require("./api/index");

const port = Number(process.env.PORT) || 5500;
const root = __dirname;

// Bloquear acesso direto aos arquivos de dados internos
app.use((req, res, next) => {
  const pathname = decodeURIComponent(req.path);
  if (pathname === "/dados" || pathname.startsWith("/dados/") || pathname.startsWith("/.git/")) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  next();
});

// Servir arquivos estáticos da raiz (HTML, CSS, JS, imagens, jogos)
app.use(express.static(root, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if ([".html", ".js", ".css"].includes(ext)) {
      res.setHeader("Cache-Control", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }
  }
}));

// Fallback para rotas estáticas
app.get("/", (req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(port, () => {
  console.log(`\n==================================================`);
  console.log(`  ML News rodando localmente`);
  console.log(`  Endereço: http://localhost:${port}`);
  console.log(`==================================================\n`);
});
