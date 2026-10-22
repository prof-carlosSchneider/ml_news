const canvas = document.getElementById('c');
const ctx = canvas ? canvas.getContext('2d') : null;
if (ctx) ctx.imageSmoothingEnabled = false;
const W = 480, H = 340;

const MOVE_SPEED = 2.2;
const BULLET_SPEED = -8.5;
const ENEMY_SPEED = 0.9;
const BOSS_SPEED = 1.6;
const SUPER_FILL = 8.5;
const Q_TRANSITION = 750;

let coins = +localStorage.getItem('eduCoins') || 60;
let unlockedPowers = JSON.parse(localStorage.getItem('eduPowers') || '["sandevistan"]');
let phasesDone = +localStorage.getItem('eduPhasesDone') || 0;
let ranking = JSON.parse(localStorage.getItem('eduRank') || '[]');
let adminMode = false, shopLife = 0, shopShield = false, selectedSuper = 'sandevistan';

// ===== 8 CHEFES OFICIAIS & MAPEAMENTO DE SPRITES =====
const BOSS_DATA = [
  { id: 'specter', name: 'Specter', hp: 600, w: 56, h: 56, spriteKey: 'Scout', lore: 'Caça Furtivo • Fase 1' },
  { id: 'warden', name: 'Warden', hp: 800, w: 58, h: 58, spriteKey: 'Support', lore: 'Guardião de Escudos • Fase 2' },
  { id: 'odissey', name: 'Odissey', hp: 1050, w: 62, h: 62, spriteKey: 'Torpedo Ship', lore: 'Balística Pesada • Fase 3' },
  { id: 'eclipse', name: 'Eclipse', hp: 1300, w: 64, h: 64, spriteKey: 'Bomber', lore: 'Bombardeiro Cósmico • Fase 4' },
  { id: 'chronos', name: 'Chronos', hp: 1600, w: 66, h: 66, spriteKey: 'Frigate', lore: 'Distorção Temporal • Fase 5' },
  { id: 'infinity', name: 'Infinity', hp: 1900, w: 68, h: 68, spriteKey: 'Fighter', lore: 'Interceptador de Elite • Fase 6' },
  { id: 'leviata', name: 'Leviatã', hp: 2300, w: 78, h: 78, spriteKey: 'Battlecruiser', lore: 'Cruzador de Batalha • Fase 7' },
  { id: 'oblivion', name: 'Oblivion', hp: 2800, w: 84, h: 84, spriteKey: 'Dreadnought', lore: 'Titã Supremo do Cosmos • Fase 8' }
];

// Carregador Central de Sprites Nautolan (Aseprite)
const SPRITES = {
  bases: {},
  engines: {},
  shields: {},
  destruction: {},
  projectiles: {}
};

function initSprites() {
  const shipKeys = [
    { key: 'Scout', file: 'Nautolan Ship - Scout - Base.png', eng: 'Nautolan Ship - Scout - Engine Effect.png', sh: 'Nautolan Ship - Scout - Shield.png', des: 'Nautolan Ship - Scout.png', fw: 64 },
    { key: 'Support', file: 'Nautolan Ship - Support - Base.png', eng: 'Nautolan Ship - Support - Engine Effect.png', sh: null, des: 'Nautolan Ship - Support.png', fw: 64 },
    { key: 'Torpedo Ship', file: 'Nautolan Ship - Torpedo Ship.png', eng: 'Nautolan Ship - Torpedo Ship - Engine Effect.png', sh: 'Nautolan Ship - Torpedo Ship - Shield.png', des: 'Nautolan Ship - Torpedo Ship.png', fw: 64 },
    { key: 'Bomber', file: 'Nautolan Ship - Bomber - Base.png', eng: 'Nautolan Ship - Bomber - Engine Effect.png', sh: 'Nautolan Ship - Bomber - Shield.png', des: 'Nautolan Ship - Bomber.png', fw: 64 },
    { key: 'Frigate', file: 'Nautolan Ship - Frigate - Base.png', eng: 'Nautolan Ship - Frigate - Engine Effect.png', sh: 'Nautolan Ship - Frigate - Shield.png', des: 'Nautolan Ship - Frigate.png', fw: 64 },
    { key: 'Fighter', file: 'Nautolan Ship - Fighter - Base.png', eng: 'Nautolan Ship - Fighter - Engine Effect.png', sh: 'Nautolan Ship - Fighter - Shield.png', des: 'Nautolan Ship - Fighter.png', fw: 64 },
    { key: 'Battlecruiser', file: 'Nautolan Ship - Battlecruiser - Base.png', eng: 'Nautolan Ship - Battlecruiser - Engine Effect.png', sh: 'Nautolan Ship - Battlecruiser - Shield.png', des: 'Nautolan Ship - Battlecruiser.png', fw: 128 },
    { key: 'Dreadnought', file: 'Nautolan Ship - Dreadnought - Base.png', eng: 'Nautolan Ship - Dreadnought - Engine Effect.png', sh: 'Nautolan Ship - Dreadnought - Shield.png', des: 'Nautolan Ship - Dreadnought.png', fw: 128 }
  ];

  shipKeys.forEach(s => {
    // Base
    const imgBase = new Image();
    imgBase.src = `spriteIdea/Nautolan/Designs - Base/PNGs/${s.file}`;
    SPRITES.bases[s.key] = { img: imgBase, frameWidth: s.fw };

    // Engines
    const imgEng = new Image();
    imgEng.src = `spriteIdea/Nautolan/Engine Effects/PNGs/${s.eng}`;
    SPRITES.engines[s.key] = { img: imgEng, frameWidth: s.fw, totalFrames: 8 };

    // Shields
    if (s.sh) {
      const imgSh = new Image();
      imgSh.src = `spriteIdea/Nautolan/Shields/PNGs/${s.sh}`;
      SPRITES.shields[s.key] = { img: imgSh, frameWidth: s.fw };
    }

    // Destruction
    const imgDes = new Image();
    imgDes.src = `spriteIdea/Nautolan/Destruction/PNGs/${s.des}`;
    SPRITES.destruction[s.key] = { img: imgDes, frameWidth: s.fw };
  });

  // Projectiles
  const projFiles = [
    { key: 'bullet', file: 'Nautolan - Bullet.png', fw: 12 },
    { key: 'spin', file: 'Nautolan - Spinning Bullet.png', fw: 8 },
    { key: 'wave', file: 'Nautolan - Wave.png', fw: 64 },
    { key: 'rocket', file: 'Nautolan - Rocket.png', fw: 32 },
    { key: 'ray', file: 'Nautolan - Ray.png', fw: 18 }
  ];
  projFiles.forEach(p => {
    const img = new Image();
    img.src = `spriteIdea/Nautolan/Weapon Effects - Projectiles/PNGs/${p.file}`;
    SPRITES.projectiles[p.key] = { img, frameWidth: p.fw };
  });
}
initSprites();

// Arcade Ranking System
let defaultArcadeRanks = [
  { tag: 'ACE', score: 18400, mode: 'Infinito', info: 'Setor 15', date: '27/08/2026' },
  { tag: 'OBL', score: 15800, mode: 'Campanha', info: 'Fase 8', date: '27/08/2026' },
  { tag: 'LEV', score: 13200, mode: 'Campanha', info: 'Fase 7', date: '27/08/2026' },
  { tag: 'INF', score: 10500, mode: 'Campanha', info: 'Fase 6', date: '27/08/2026' },
  { tag: 'CHR', score: 8100, mode: 'Campanha', info: 'Fase 5', date: '27/08/2026' },
  { tag: 'ECL', score: 6200, mode: 'Infinito', info: 'Setor 6', date: '27/08/2026' },
  { tag: 'ODI', score: 4500, mode: 'Campanha', info: 'Fase 3', date: '27/08/2026' },
  { tag: 'SPC', score: 2100, mode: 'Campanha', info: 'Fase 1', date: '27/08/2026' }
];
let arcadeRankings = JSON.parse(localStorage.getItem('eduArcadeRank') || 'null');
if (!arcadeRankings || !Array.isArray(arcadeRankings) || arcadeRankings.length === 0) {
  arcadeRankings = defaultArcadeRanks;
  localStorage.setItem('eduArcadeRank', JSON.stringify(arcadeRankings));
}

let gameState = 'MENU', score = 0, lives = 5, maxLives = 5;
let currentPhaseIdx = 0, qIndex = 0, currentPhaseData = null, currentQuestion = null, theme = 'space';
let superMeter = 0, superReady = false, superActive = false, superTimer = 0, powerUsesLeft = 3;
let timeScale = 1, zaActive = false, sukunaActive = false, sukunaTransformed = false;
let shieldActive = false, shieldTimer = 0, parryWindow = 0, parryFlash = 0, lastParryTime = 0;

let keys = {};
let bullets = [];
let enemies = [];
let enemyBullets = [];
let bossBullets = [];
let particles = [];
let minions = [];
let slashes = [];
let cherries = [];
let lasers = [];
let afterimages = [];
let floatingTexts = [];

let bossMode = false, currentBoss = null, isMiniBoss = false, shake = 0;
const player = { x: 220, y: 280, w: 28, h: 24, invuln: 0, lastShot: 0 };
let playerStats = { damage: 1, fireRate: 350, multiShot: 1, bounce: 0, lifesteal: 0, pierce: false, moveSpeed: 2.2, parryBonus: 0 };
let activeBoons = [];
let pendingBoon = null;

// Controle de Waves, Reroll e Modo Infinito
let currentWave = 1;
let totalWavesCleared = 0;
let inQuestionWave = false;
let rerollMode = false;
let rerollQuestionsLeft = 0;

let isEndlessMode = false;
let endlessSector = 1;

// Sistema de Rally / Regain de Dano
let lastDamageTime = 0;
let recoverableHealth = 0;

let lastTime = performance.now();