const { createClient } = require("@libsql/client");
const path = require("path");
require("dotenv").config();

let client = null;

function getDb() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, "..", "dados", "local.db")}`;
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  client = createClient({
    url,
    authToken,
  });

  return client;
}

async function initDb() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS portal_content (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      title TEXT,
      plays INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      at DATETIME DEFAULT CURRENT_TIMESTAMP,
      area TEXT NOT NULL,
      summary TEXT NOT NULL,
      changes_json TEXT,
      images_json TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = {
  getDb,
  initDb,
};
