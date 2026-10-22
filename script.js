const $ = (s) => document.querySelector(s);
const CONTACT_LOGS_KEY = "colegioHorizonteContactLogs";
let sharedData = null;
let globalSearchTerm = "";
let calendarDate = new Date();
if (calendarDate.getFullYear() !== 2026) calendarDate = new Date(2026, 0, 1);
const SCHOOL_CALENDAR_2026 = [
  ["2026-01-26", "Início das aulas do ano letivo", "AULAS"],
  ["2026-02-16", "Carnaval", "FERIADO"],
  ["2026-02-17", "Carnaval", "FERIADO"],
  ["2026-02-18", "Recesso escolar", "RECESSO"],
  ["2026-02-05", "Início do 1º trimestre: 05/02 a 14/05 · 63 dias letivos", "TRIMESTRE"],
  ["2026-03-16", "Semana de combate à violência contra a mulher", "CAMPANHA"],
  ["2026-03-20", "Semana de combate à violência contra a mulher", "CAMPANHA"],
  ["2026-04-03", "Paixão de Cristo", "FERIADO"],
  ["2026-04-05", "Páscoa", "FERIADO"],
  ["2026-04-21", "Tiradentes", "FERIADO"],
  ["2026-05-01", "Dia do Trabalho", "FERIADO"],
  ["2026-05-01", "Prova Paraná 2026 ocorre durante o mês de maio", "AVALIAÇÃO"],
  ["2026-05-14", "Encerramento do 1º trimestre · 63 dias letivos", "TRIMESTRE"],
  ["2026-05-18", "Início do 2º trimestre: 18/05 a 04/09 · 68 dias letivos", "TRIMESTRE"],
  ["2026-09-04", "Encerramento do 2º trimestre · 68 dias letivos", "TRIMESTRE"],
  ["2026-06-04", "Corpus Christi", "FERIADO"],
  ["2026-06-05", "Recesso escolar", "RECESSO"],
  ["2026-07-13", "Início das férias escolares", "FÉRIAS"],
  ["2026-07-24", "Fim das férias escolares", "FÉRIAS"],
  ["2026-07-27", "Início do segundo semestre letivo", "AULAS"],
  ["2026-08-06", "Reposição do calendário escolar", "REPOSIÇÃO"],
  ["2026-08-07", "Dia do Funcionário de Escola", "DATA COMEMORATIVA"],
  ["2026-08-11", "Dia do Estudante", "DATA COMEMORATIVA"],
  ["2026-09-07", "Independência do Brasil", "FERIADO"],
  ["2026-09-08", "Início do 3º trimestre: 08/09 a 18/12 · 69 dias letivos", "TRIMESTRE"],
  ["2026-09-01", "Prova Paraná 2026 ocorre durante o mês de setembro", "AVALIAÇÃO"],
  ["2026-10-12", "Nossa Senhora Aparecida", "FERIADO"],
  ["2026-10-13", "Dia Internacional para a Redução do Risco e Desastre; Dia do Professor (antecipado)", "DATA COMEMORATIVA"],
  ["2026-10-15", "Dia do Professor", "DATA COMEMORATIVA"],
  ["2026-10-28", "Dia do Servidor Público", "DATA COMEMORATIVA"],
  ["2026-11-02", "Finados", "FERIADO"],
  ["2026-11-15", "Proclamação da República", "FERIADO"],
  ["2026-11-20", "Dia da Consciência Negra", "FERIADO"],
  ["2026-12-18", "Término das aulas do ano letivo", "AULAS"],
  ["2026-12-21", "Início das férias do ano letivo 2027", "FÉRIAS"],
  ["2026-12-25", "Natal", "FERIADO"],
];
const defaultData = {
  news: [
    {
      title: "Tecnologia e criatividade transformam a aprendizagem",
      summary:
        "Projetos desenvolvidos pelos estudantes mostram novas formas de aprender e compartilhar conhecimento.",
      category: "TECNOLOGIA",
      date: "12/09/2024",
    },
    {
      title: "Comunidade escolar prepara programação cultural",
      summary:
        "Arte, música e participação estudantil estarão no centro das próximas atividades.",
      category: "CULTURA",
      date: "10/09/2024",
    },
    {
      title: "Estudantes representam Antonina em competição esportiva",
      summary:
        "As equipes do colégio participam de uma agenda esportiva cheia de desafios.",
      category: "ESPORTES",
      date: "08/09/2024",
    },
    {
      title: "Projetos aproximam escola e comunidade",
      summary:
        "A escola amplia ações de integração com as famílias e instituições de Antonina.",
      category: "COMUNIDADE ESCOLAR",
      date: "05/09/2024",
    },
    {
      title: "Novas experiências para o ano letivo",
      summary:
        "Professores e estudantes constroem juntos uma escola cada vez mais conectada.",
      category: "EDUCAÇÃO",
      date: "02/09/2024",
    },
    {
      title: "Feira de conhecimentos reúne diferentes áreas",
      summary:
        "Ciência, pesquisa e curiosidade movimentam os espaços da instituição.",
      category: "PROJETOS",
      date: "30/08/2024",
    },
  ],
  notices: [
    {
      type: "URGENTE",
      title: "Comunicado oficial da direção",
      description: "Espaço reservado para avisos urgentes da instituição.",
    },
    {
      type: "IMPORTANTE",
      title: "Reuniões e atividades escolares",
      description:
        "Consulte os comunicados oficiais antes de programar sua participação.",
    },
    {
      type: "INFORMATIVO",
      title: "Documentos e inscrições",
      description: "Novos prazos e orientações serão publicados neste espaço.",
    },
  ],
  menu: [
    {
      day: "SEGUNDA",
      main: "Arroz, feijão e frango",
      breakfast: "Pão e fruta",
      lunch: "Salada e frango assado",
      snack: "Bolo de milho",
    },
    {
      day: "TERÇA",
      main: "Macarrão à bolonhesa",
      breakfast: "Leite e biscoito",
      lunch: "Macarrão e legumes",
      snack: "Sanduíche natural",
    },
    {
      day: "QUARTA",
      main: "Arroz, feijão e peixe",
      breakfast: "Iogurte e fruta",
      lunch: "Peixe e purê",
      snack: "Vitamina de banana",
    },
    {
      day: "QUINTA",
      main: "Arroz colorido",
      breakfast: "Pão com queijo",
      lunch: "Arroz e carne",
      snack: "Frutas da estação",
    },
    {
      day: "SEXTA",
      main: "Feijão tropeiro",
      breakfast: "Fruta e leite",
      lunch: "Arroz e carne",
      snack: "Pão caseiro",
    },
  ],
  history: [
    {
      eyebrow: "MEMÓRIA E IDENTIDADE",
      title: "História do Moysés Lupion",
      description: "Esta seção será preenchida com a trajetória oficial da instituição, seus projetos, conquistas e a participação da comunidade escolar.",
      item1Label: "HISTÓRIA", item1Text: "Conteúdo oficial em preparação.",
      item2Label: "COMUNIDADE", item2Text: "Depoimentos e registros serão adicionados.",
      item3Label: "FUTURO", item3Text: "Uma escola conectada às novas possibilidades.",
    },
  ],
  images: [
    {
      logo: "imagens/logo-ml-news.png",
      emblem: "imagens/emblema-ccm.jpg",
      heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
      schoolPhoto: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
      historyPhoto: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
      newsImages: "photo-1516321318423-f06f85e504b3\nphoto-1513364776144-60967b0f800f\nphoto-1546519638-68e109498ffc\nphoto-1509062522246-3755977927d7\nphoto-1524178232363-1fb2b075b655\nphoto-1498243691581-b145c3f54a5a",
      galleryImages: "photo-1523240795612-9a054b0db644|EVENTOS\nphoto-1531482615713-2afd69097998|PROJETOS\nphoto-1461896836934-ffe607ba8211|ESPORTES\nphoto-1529070538774-1843cb3265df|EVENTOS\nphoto-1516321318423-f06f85e504b3|PROJETOS",
    },
  ],
  tralhaTv: [{
    eyebrow: "CANAL DOS ESTUDANTES", title: "Tralha TV",
    description: "Conteúdo caótico, autêntico e sem filtro feito pela comunidade estudantil.",
    heroImage: "imagens/uploads/tralha-tv/tralha-tv-capa-painel.jpeg",
    dogImage: "imagens/uploads/tralha-tv/tralha-tv-pagina-inicial.jpeg",
    socials: "instagram|@tralhatv|https://instagram.com/tralhatv\ntiktok|@tralhatv|https://tiktok.com/@tralhatv\nyoutube|/tralhatv|https://youtube.com/@tralhatv\ntwitter|@tralhatv|https://twitter.com/tralhatv",
    members: "Annabelly|imagens/uploads/tralha-tv/annabelly-logo.jpeg\nMaria|imagens/uploads/tralha-tv/tralha-tv-encerramento-01.jpeg\nLyra|imagens/uploads/tralha-tv/lyra-logo.jpeg\nDaniel|imagens/uploads/tralha-tv/tralha-tv-encerramento-02.jpeg\nGabi|imagens/uploads/tralha-tv/gabi-logo.jpeg\nAlice|imagens/uploads/tralha-tv/alice-logo.jpeg\nJu|imagens/uploads/tralha-tv/tralha-tv-encerramento-03.jpeg\nMavi|imagens/uploads/tralha-tv/mavi-logo.jpeg",
    videos: "Episódio de estreia|https://www.youtube.com/@tralhatv|Conheça a Tralha TV\nAo vivo|https://www.youtube.com/@tralhatv/live|Acompanhe as novidades",
  }],
};
function data() {
  if (sharedData) return sharedData;
  try {
    return (
      JSON.parse(localStorage.getItem("colegioHorizonteData")) || defaultData
    );
  } catch {
    return defaultData;
  }
}

function getImages() {
  return data()?.images?.[0] || defaultData.images[0];
}

function applyPortalImages() {
  const images = getImages();
  const heroImage = document.querySelector(".hero-image");
  if (heroImage) heroImage.style.backgroundImage = `linear-gradient(120deg, #dc262655, #0000), url("${images.heroImage}")`;
  const schoolPhoto = document.querySelector(".photo-school");
  if (schoolPhoto) schoolPhoto.style.backgroundImage = `url("${images.schoolPhoto}")`;
  const historyPhoto = document.querySelector(".history-photo");
  if (historyPhoto) historyPhoto.style.backgroundImage = `url("${images.historyPhoto}")`;
  document.querySelectorAll(".logo-box img:first-child, footer img").forEach((image) => {
    image.src = images.logo || "imagens/logo-ml-news.png";
  });
  const emblemImage = document.querySelector(".logo-box img:nth-of-type(2)");
  if (emblemImage) emblemImage.src = images.emblem || "imagens/emblema-ccm.jpg";
}

function renderPortalContent() {
  renderNews();
  renderNotices();
  renderMenu();
  renderGallery();
  renderContact();
  renderHistory();
  renderTralhaTv();
  applyPortalImages();
  setupRevealAnimations();
  addAmbientMotion();
  setupCinematicMotion();
}

function renderTralhaTv() {
  const section = $("#tralha-tv");
  if (!section) return;
  const content = data().tralhaTv?.[0] || defaultData.tralhaTv[0];
  const setText = (id, value) => { const element = $(id); if (element) element.textContent = value || ""; };
  setText("#tralha-tv-eyebrow", content.eyebrow);
  setText("#tralha-tv-title", content.title);
  setText("#tralha-tv-description", content.description);
  const hero = $("#tralha-tv-hero");
  if (hero) hero.style.backgroundImage = `url("${content.heroImage}")`;
  const dog = $("#tralha-tv-dog");
  if (dog) dog.src = content.dogImage;
  $("#tralha-tv-socials").innerHTML = (content.socials || "").split("\n").filter(Boolean).map((line) => {
    const [network, handle, url] = line.split("|");
    return `<a href="${esc(url || "#")}" target="_blank" rel="noreferrer"><b>${esc(network)}</b><span>${esc(handle || "")}</span></a>`;
  }).join("");
  $("#tralha-tv-members").innerHTML = (content.members || "").split("\n").filter(Boolean).map((line) => {
    const [name] = line.split("|");
    return `<span class="tralha-member-name">${esc(name || "")}</span>`;
  }).join("");
  $("#tralha-tv-videos").innerHTML = (content.videos || "").split("\n").filter(Boolean).map((line) => {
    const [title, url, description] = line.split("|");
    const media = /youtube\.com|youtu\.be/.test(url || "") ? `<a class="tralha-video-link" href="${esc(url)}" target="_blank" rel="noreferrer">▶ Assistir no YouTube</a>` : `<video controls preload="metadata" src="${esc(url)}"></video>`;
    return `<article class="tralha-video">${media}<h3>${esc(title)}</h3><p>${esc(description || "Novo conteúdo da Tralha TV")}</p></article>`;
  }).join("");
}

let revealObserver;
function setupRevealAnimations() {
  const elements = document.querySelectorAll(".section-title, .headline-strip a, .news-card, .notice, .menu-card, .gallery-item, .history-copy, .contact-grid > *");
  if (!("IntersectionObserver" in window)) return;
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
  }
  elements.forEach((element) => {
    if (element.classList.contains("reveal-ready")) return;
    element.classList.add("reveal-ready");
    revealObserver.observe(element);
  });
}

function addAmbientMotion() {
  document.querySelectorAll(".news-card, .menu-card, .notice, .gallery-item, .tralha-video").forEach((item, index) => {
    item.style.setProperty("--delay", `${index * 80}ms`);
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      item.style.transform = `perspective(900px) rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) translateY(-4px)`;
    });
    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

function setupCinematicMotion() {
  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");
  if (!hero || !heroImage) return;

  const handleMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 10;
    heroImage.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  hero.removeEventListener("pointermove", hero._cinematicHandler);
  hero._cinematicHandler = handleMove;
  hero.addEventListener("pointermove", handleMove);
  hero.addEventListener("pointerleave", () => {
    heroImage.style.transform = "";
  }, { once: false });
}

async function loadSharedContent() {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (!payload.data) return;
    sharedData = payload.data;
    localStorage.setItem("colegioHorizonteData", JSON.stringify(sharedData));
    renderPortalContent();
  } catch {
    // O portal continua disponível em modo local quando aberto sem o servidor.
  }
}
function getContactLogs() {
  try {
    const logs = JSON.parse(localStorage.getItem(CONTACT_LOGS_KEY));
    return Array.isArray(logs) ? logs : [];
  } catch {
    return [];
  }
}
function esc(v = "") {
  return String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}
function renderNews(filter = "TODAS") {
  const grid = $("#news-grid");
  if (!grid) return;
  
  const images = getImages().newsImages.split("\n").filter(img => img.trim());
  const baseUrl = "https://images.unsplash.com/";
  
  grid.innerHTML = data()
    .news.filter((n) => filter === "TODAS" || n.category === filter)
    .map(
      (n, i) => {
        const imageId = images[i % images.length]?.trim() || "photo-1516321318423-f06f85e504b3";
        const imageUrl = imageId.startsWith("http") || imageId.startsWith("data:") ? imageId : `${baseUrl}${imageId}?auto=format&fit=crop&w=700&q=80`;
        return `<article class="news-card"><img src="${imageUrl}" alt="${esc(n.title)}"><div class="body"><span class="category ${n.category === "TECNOLOGIA" ? "cyan-label" : "red-label"}">${esc(n.category)}</span><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><div class="news-date">${esc(n.date)}</div></div></article>`;
      }
    )
    .join("");
  applyGlobalSearch();
}

function applyGlobalSearch() {
  const term = globalSearchTerm.trim().toLocaleLowerCase("pt-BR");
  const targets = document.querySelectorAll(".news-card, .notice, .menu-card, .gallery-item, .history-copy, .contact-grid > *");
  let visible = 0;
  targets.forEach((target) => {
    const matches = !term || target.textContent.toLocaleLowerCase("pt-BR").includes(term);
    target.hidden = !matches;
    if (matches) visible += 1;
  });
  const count = $("#search-results-count");
  if (count) count.textContent = term ? `${visible} resultado${visible === 1 ? "" : "s"} encontrado${visible === 1 ? "" : "s"}` : "Digite para pesquisar em todo o portal";
}

function renderNotices() {
  const el = $("#notice-list");
  if (!el) return;
  el.innerHTML = data()
    .notices.map(
      (n) =>
        `<article class="notice ${n.type.toLowerCase()}"><div class="notice-icon">${n.type === "URGENTE" ? "!" : n.type === "IMPORTANTE" ? "◆" : "i"}</div><div><span class="category ${n.type === "URGENTE" ? "red-label" : n.type === "IMPORTANTE" ? "gold-label" : "cyan-label"}">${esc(n.type)}</span><h3>${esc(n.title)}</h3><p>${esc(n.description)}</p><small>Comunicado oficial · Colégio Estadual Moysés Lupion</small></div></article>`,
    )
    .join("");
}
function renderMenu() {
  const el = $("#menu-grid");
  if (!el) return;
  const today = new Date().getDay();
  const dayNames = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
  const todayName = dayNames[today];
  el.innerHTML = data()
    .menu.map(
      (m, i) =>
        `<article class="menu-card ${m.day === todayName ? "today" : ""}"><b>${esc(m.day)} ${m.day === todayName ? "· HOJE" : ""}</b><h3>${esc(m.main)}</h3><p><strong>Café da manhã</strong><br>${esc(m.breakfast)}<br><br><strong>Almoço</strong><br>${esc(m.lunch)}<br><br><strong>Lanche</strong><br>${esc(m.snack)}</p></article>`,
    )
    .join("");
}
function renderGallery(filter = "TODAS") {
  const el = $("#gallery-grid");
  if (!el) return;
  
  const galleryImagesStr = getImages().galleryImages || "";
  const galleryLines = galleryImagesStr.split("\n").filter(line => line.trim());
  
  const items = galleryLines.map(line => {
    const [id, category] = line.split("|").map(s => s.trim());
    const descriptions = {
      "EVENTOS": "Atividades da comunidade escolar",
      "PROJETOS": "Aprender fazendo",
      "ESPORTES": "Movimento e participação"
    };
    return [category, descriptions[category] || category, id];
  });
  
  const baseUrl = "https://images.unsplash.com/";
  
  el.innerHTML = items
    .filter((x) => filter === "TODAS" || x[0] === filter)
    .map(
      (x) => {
        const imageUrl = x[2].startsWith("http") || x[2].startsWith("data:") || x[2].startsWith("imagens/") ? x[2] : `${baseUrl}${x[2]}?auto=format&fit=crop&w=800&q=80`;
        return `<figure class="gallery-item"><img src="${imageUrl}" alt="${x[1]}"><figcaption>${x[1]} · ${x[0]}</figcaption></figure>`;
      }
    )
    .join("");
  document.querySelectorAll(".gallery-item").forEach(
    (item) =>
      (item.onclick = () => {
        const m = $("#image-modal");
        m.classList.add("open");
        m.querySelector("img").src = item.querySelector("img").src;
        m.querySelector("img").alt = item.querySelector("img").alt;
      }),
  );
}
function renderContact() {
  const contact = data().contact?.[0];
  if (!contact) return;
  const location = $("#contact-location");
  const address = $("#contact-address");
  const phone = $("#contact-phone");
  const email = $("#contact-email");
  const hours = $("#contact-hours");
  if (location) location.textContent = contact.address || "Antonina — Paraná — Brasil";
  if (address) address.textContent = contact.address || "informação oficial a preencher";
  if (phone) phone.textContent = contact.phone || "informação oficial a preencher";
  if (email) email.textContent = contact.email || "informação oficial a preencher";
  if (hours) hours.textContent = contact.hours || "informação oficial a preencher";
}
function renderHistory() {
  const history = data().history?.[0];
  if (!history) return;
  const values = [
    ["#history-eyebrow", history.eyebrow], ["#history-title", history.title], ["#history-description", history.description],
    ["#history-label-0", history.item1Label], ["#history-text-0", history.item1Text],
    ["#history-label-1", history.item2Label], ["#history-text-1", history.item2Text],
    ["#history-label-2", history.item3Label], ["#history-text-2", history.item3Text],
  ];
  values.forEach(([selector, value]) => {
    const element = $(selector);
    if (element && value) element.textContent = value;
  });
}
function calendar() {
  const el = $("#calendar-days");
  if (!el) return;
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" })
    .format(calendarDate)
    .toUpperCase();
  const monthTitle = $("#calendar-month");
  const monthEvents = SCHOOL_CALENDAR_2026.filter(([date]) => {
    const eventDate = new Date(`${date}T12:00:00`);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
  const eventDays = new Set(monthEvents.map(([date]) => Number(date.slice(-2))));

  if (monthTitle) monthTitle.textContent = `${monthName} ${year}`;
  const previousButton = $("#calendar-previous");
  const nextButton = $("#calendar-next");
  if (previousButton) previousButton.disabled = year === 2026 && month === 0;
  if (nextButton) nextButton.disabled = year === 2026 && month === 11;
  el.innerHTML = Array.from({ length: firstDay + daysInMonth }, (_, index) => {
    if (index < firstDay) return "<span aria-hidden=\"true\"></span>";
    const day = index - firstDay + 1;
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const hasEvent = eventDays.has(day);
    const classes = [isToday ? "today" : "", hasEvent ? "event" : ""].filter(Boolean).join(" ");
    return `<span class="${classes}"${isToday ? ' aria-current="date"' : ""}>${day}</span>`;
  }).join("");

  const eventList = $("#event-list");
  if (eventList) {
    eventList.innerHTML = monthEvents.length
      ? monthEvents.map(([date, title, type], index) => {
          const eventDate = new Date(`${date}T12:00:00`);
          const day = String(eventDate.getDate()).padStart(2, "0");
          const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(eventDate).replace(".", "").toUpperCase();
          const hiddenClass = index >= 3 ? ' class="agenda-extra" hidden' : "";
          return `<article${hiddenClass}><time>${day}<small>${weekday}</small></time><div><span class="category cyan-label">${esc(type)}</span><h3>${esc(title)}</h3><p>Calendário escolar 2026 · Colégio Estadual Moysés Lupion</p></div></article>`;
        }).join("") + (monthEvents.length > 3 ? '<button class="button button-line agenda-more" type="button">Ver mais</button>' : "")
      : '<p class="empty-events">Nenhum evento cadastrado para este mês.</p>';
  }
}
function setup() {
  applyPortalImages();

  if (localStorage.getItem("mlnewsTheme") === "light") document.body.classList.add("light");

  $(".menu-toggle")?.addEventListener("click", (e) => {
    $(".main-nav").classList.toggle("open");
    e.currentTarget.setAttribute(
      "aria-expanded",
      $(".main-nav").classList.contains("open"),
    );
  });
  document
    .querySelectorAll(".main-nav a")
    .forEach(
      (a) => (a.onclick = () => $(".main-nav").classList.remove("open")),
    );
  $("#theme-toggle")?.addEventListener("click", () => {
    const light = document.body.classList.toggle("light");
    localStorage.setItem("mlnewsTheme", light ? "light" : "dark");
  });
  $("#search-toggle")?.addEventListener("click", () =>
    $("#search-panel").classList.toggle("open"),
  );
  $("#calendar-previous")?.addEventListener("click", () => {
    if (calendarDate.getFullYear() === 2026 && calendarDate.getMonth() === 0) return;
    calendarDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() - 1,
      1,
    );
    calendar();
  });
  $("#calendar-next")?.addEventListener("click", () => {
    if (calendarDate.getFullYear() === 2026 && calendarDate.getMonth() === 11) return;
    calendarDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
      1,
    );
    calendar();
  });
  document.querySelectorAll(".view-switch button[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const isList = button.dataset.view === "list";
      document.querySelector(".agenda-layout")?.classList.toggle("list-mode", isList);
      document.querySelectorAll(".view-switch button[data-view]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
  $("#event-list")?.addEventListener("click", (event) => {
    const button = event.target.closest(".agenda-more");
    if (!button) return;
    const eventList = event.currentTarget;
    const extras = eventList.querySelectorAll(".agenda-extra");
    const expanded = button.dataset.expanded === "true";
    extras.forEach((item) => {
      item.hidden = expanded;
    });
    button.dataset.expanded = String(!expanded);
    button.textContent = expanded ? "Ver mais" : "Ver menos";
  });
  $("#global-search")?.addEventListener("input", (e) => {
    globalSearchTerm = e.target.value;
    applyGlobalSearch();
  });
  document.querySelectorAll("#news-filters .filter").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("#news-filters .filter")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        renderNews(b.dataset.filter);
      }),
  );
  document.querySelectorAll("#gallery-filters .filter").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("#gallery-filters .filter")
          .forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        renderGallery(b.dataset.gallery);
      }),
  );
  $("#image-modal button")?.addEventListener("click", () =>
    $("#image-modal").classList.remove("open"),
  );
  $("#contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const preview = $("#message-preview");
    $("#preview-name").textContent = name;
    $("#preview-email").textContent = email;
    $("#preview-message").textContent = message;
    preview.hidden = false;
    preview.dataset.name = name;
    preview.dataset.email = email;
    preview.dataset.message = message;
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#confirm-message")?.addEventListener("click", async () => {
    const preview = $("#message-preview");
    const message = {
      name: preview.dataset.name,
      email: preview.dataset.email,
      message: preview.dataset.message,
      submittedAt: new Date().toISOString(),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error("Falha ao enviar");
    } catch {
      const logs = getContactLogs();
      logs.unshift(message);
      localStorage.setItem(CONTACT_LOGS_KEY, JSON.stringify(logs));
    }
    $("#contact-form").reset();
    preview.hidden = true;
  });
  $("#edit-message")?.addEventListener("click", () => {
    $("#message-preview").hidden = true;
  });
}
renderPortalContent();
calendar();
setup();
loadSharedContent();
if (location.protocol !== "file:") setInterval(loadSharedContent, 45000);

// Atualizar logo
document.addEventListener("DOMContentLoaded", () => {
  applyPortalImages();
});
