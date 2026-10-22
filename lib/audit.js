function formatValue(value) {
  if (value === undefined || value === null || value === "") return "(vazio)";
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : JSON.stringify(value);
  return text.length > 150 ? `${text.slice(0, 147)}…` : text;
}

function describeContentPath(pathValue) {
  const labels = {
    news: "Notícia", notices: "Comunicado", menu: "Cardápio", history: "Memória e identidade", settings: "Configurações",
    contact: "Contato", images: "Imagem", title: "título", summary: "resumo",
    category: "categoria", date: "data", type: "tipo", description: "descrição",
    day: "dia", main: "prato principal", breakfast: "café da manhã", lunch: "almoço",
    snack: "lanche", siteTitle: "título do portal", siteSlogan: "slogan",
    siteDescription: "descrição do portal", address: "endereço", phone: "telefone",
    eyebrow: "chamada", item1Label: "1º destaque", item1Text: "texto do 1º destaque",
    item2Label: "2º destaque", item2Text: "texto do 2º destaque", item3Label: "3º destaque", item3Text: "texto do 3º destaque",
    email: "e-mail", hours: "horário", logo: "logo", emblem: "emblema",
    heroImage: "foto de capa", schoolPhoto: "foto da escola", historyPhoto: "foto da história",
    newsImages: "fotos das notícias", galleryImages: "galeria de fotos",
    tralhaTv: "Tralha TV", socials: "redes sociais", members: "integrantes", videos: "vídeos"
  };
  return pathValue.split(".").map((part) => /^\d+$/.test(part) ? ` ${Number(part) + 1}` : (labels[part] || part)).join(" · ");
}

function isImagePath(pathValue) {
  return /(^|\.)(images)\.0\.(logo|emblem|heroImage|schoolPhoto|historyPhoto|newsImages|galleryImages)$/.test(pathValue) ||
         /(^|\.)(tralhaTv)\.0\.(heroImage|dogImage)$/.test(pathValue);
}

function imageSources(value) {
  if (typeof value !== "string" || value.startsWith("data:")) return [];
  return value.split("\n")
    .map((entry) => entry.trim().split("|")[0])
    .filter((entry) => entry && (entry.startsWith("http") || entry.startsWith("imagens/") || entry.startsWith("/api/uploads/")))
    .slice(0, 6);
}

function contentChanges(before, after, currentPath = "") {
  const changes = [];
  const beforeObject = before && typeof before === "object";
  const afterObject = after && typeof after === "object";
  if (beforeObject || afterObject) {
    const keys = new Set([...Object.keys(beforeObject ? before : {}), ...Object.keys(afterObject ? after : {})]);
    for (const key of keys) {
      changes.push(...contentChanges(before?.[key], after?.[key], currentPath ? `${currentPath}.${key}` : key));
    }
    return changes;
  }
  if (JSON.stringify(before) === JSON.stringify(after)) return changes;
  changes.push({
    field: describeContentPath(currentPath),
    before: formatValue(before),
    after: formatValue(after),
    images: isImagePath(currentPath) ? imageSources(after) : [],
  });
  return changes;
}

function gameChanges(before = [], after = []) {
  const changes = [];
  const limit = Math.max(before.length, after.length);
  for (let index = 0; index < limit; index += 1) {
    const oldGame = before[index];
    const newGame = after[index];
    if (!oldGame && newGame) {
      changes.push({ field: "Jogo criado", before: "(não existia)", after: formatValue(newGame.title) });
      continue;
    }
    if (oldGame && !newGame) {
      changes.push({ field: "Jogo removido", before: formatValue(oldGame.title), after: "(removido)" });
      continue;
    }
    for (const field of ["title", "subject", "className", "author", "tags", "image", "url", "html", "css", "js"]) {
      if (oldGame[field] === newGame[field]) continue;
      const code = ["html", "css", "js"].includes(field);
      changes.push({
        field: `${newGame.title || oldGame.title} · ${code ? "código do projeto" : field}`,
        before: code ? "Código anterior" : formatValue(oldGame[field]),
        after: code ? "Código atualizado" : formatValue(newGame[field]),
        images: field === "image" ? imageSources(newGame[field]) : []
      });
    }
  }
  return changes;
}

module.exports = {
  contentChanges,
  gameChanges,
};
