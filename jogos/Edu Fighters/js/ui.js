function save() {
  localStorage.setItem('eduCoins', coins);
  localStorage.setItem('eduPowers', JSON.stringify(unlockedPowers));
  localStorage.setItem('eduPhasesDone', phasesDone);
  localStorage.setItem('eduRank', JSON.stringify(ranking));
  localStorage.setItem('eduArcadeRank', JSON.stringify(arcadeRankings));
  updateUI();
}

function updateUI() {
  document.getElementById('coins-val').textContent = coins;
  const sc = document.getElementById('shop-coins'); if (sc) sc.textContent = coins;
  for (let i = 0; i < 8; i++) {
    const p = document.getElementById('phase-' + i);
    if (p) {
      if (i === 0 || phasesDone >= i || adminMode) p.classList.remove('locked');
      else p.classList.add('locked');
    }
  }
  for (let i = 0; i < 8; i++) {
    const b = document.getElementById('boss-' + i);
    if (b) {
      if (phasesDone > i || adminMode) b.classList.remove('locked');
      else b.classList.add('locked');
    }
  }
  ['sandevistan', 'nova', 'horizon', 'theworld', 'sukuna', 'opala', 'cereja'].forEach(p => {
    const el = document.getElementById('pow-' + p); if (!el) return;
    if (unlockedPowers.includes(p) || adminMode || p === 'sandevistan') el.classList.remove('locked');
    else el.classList.add('locked');
    el.classList.toggle('selected', selectedSuper === p);
  });
  const names = {
    sandevistan: 'Sandevistan',
    nova: 'Nova Shield',
    horizon: 'Event Horizon',
    theworld: 'THE WORLD',
    sukuna: 'Rei das Maldições',
    opala: 'Raio Opala',
    cereja: 'Cereja'
  };
  document.getElementById('current-power-name').textContent = names[selectedSuper] || selectedSuper;
}

function selectPower(p) {
  if (!unlockedPowers.includes(p) && !adminMode && p !== 'sandevistan') return alert('Bloqueado');
  selectedSuper = p;
  updateUI();
}

function renderShop() {
  document.getElementById('shop-list').innerHTML = shopItems.map(it => {
    const owned = it.power && unlockedPowers.includes(it.id);
    return `<div class="shop-item"><div><b>${it.name}</b></div><button ${owned ? 'disabled' : ''} onclick="buy('${it.id}',${it.price})">${owned ? 'TENHO' : it.price + ' 🪙'}</button></div>`;
  }).join('');
}

function buy(id, price) {
  if (coins < price) return alert('Sem moedas');
  if (id === 'life') { coins -= price; shopLife++; save(); alert('+1 vida'); }
  else if (id === 'shield') { coins -= price; shopShield = true; save(); alert('Escudo comprado'); }
  else if (shopItems.find(x => x.id === id)?.power) {
    if (unlockedPowers.includes(id)) return;
    coins -= price; unlockedPowers.push(id); save(); alert(id + ' liberado!');
  }
  renderShop();
}

function redeemCode() {
  const c = (document.getElementById('code-input').value || '').trim().toLowerCase();
  if (c === 'lordotavio') { adminMode = true; document.getElementById('admin-badge').style.display = 'block'; updateUI(); alert('ADM ATIVADO'); }
  else if (c === 'sukuna') { if (!unlockedPowers.includes('sukuna')) unlockedPowers.push('sukuna'); save(); alert('Poder Sukuna liberado!'); }
  else if (c === 'arcoiris') { if (!unlockedPowers.includes('opala')) unlockedPowers.push('opala'); save(); alert('Raio Opala liberado!'); }
  else if (c === 'cereja') { if (!unlockedPowers.includes('cereja')) unlockedPowers.push('cereja'); save(); alert('Poder Cereja liberado!'); }
  else if (c === 'lordthur') { adminMode = false; document.getElementById('admin-badge').style.display = 'none'; alert('ADM desativado'); }
  else if (c === 'resetall') {
    if (!confirm('Apagar TODO o progresso e recordes?')) return;
    coins = 60; unlockedPowers = ['sandevistan']; phasesDone = 0; ranking = []; shopLife = 0; shopShield = false; selectedSuper = 'sandevistan'; adminMode = false;
    arcadeRankings = defaultArcadeRanks;
    localStorage.removeItem('eduCoins'); localStorage.removeItem('eduPowers'); localStorage.removeItem('eduPhasesDone'); localStorage.removeItem('eduRank'); localStorage.removeItem('eduArcadeRank');
    document.getElementById('admin-badge').style.display = 'none'; save(); updateUI(); alert('RESETADO COM SUCESSO!');
  } else alert('Código Inválido');
  document.getElementById('code-input').value = '';
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  if (id) document.getElementById(id)?.classList.remove('hidden');
  if (id === 'screen-shop') { updateUI(); renderShop(); }
  if (id === 'screen-highscore') renderRank();
  if (id === 'screen-phases' || id === 'screen-boss' || id === 'screen-powers') updateUI();
}

// ===== SISTEMA DE RANKING RETRO ARCADE =====
let activeRankFilter = 'ALL';

function filterRank(filter) {
  activeRankFilter = filter;
  renderRank();
}

function renderRank() {
  const el = document.getElementById('rank-list');
  if (!el) return;

  let list = [...arcadeRankings].sort((a, b) => b.score - a.score);
  if (activeRankFilter === 'CAMPANHA') list = list.filter(r => r.mode === 'Campanha');
  if (activeRankFilter === 'INFINITO') list = list.filter(r => r.mode === 'Infinito');

  if (!list.length) {
    el.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">NENHUM RECORDE GRAVADO</p>';
    return;
  }

  let html = `
    <div style="display:flex; justify-content:center; gap:6px; margin-bottom:8px;">
      <button style="padding:4px 8px; font-size:0.75rem; ${activeRankFilter==='ALL'?'border-color:#00f3ff; background:#00f3ff22;':''}" onclick="filterRank('ALL')">TODOS</button>
      <button style="padding:4px 8px; font-size:0.75rem; ${activeRankFilter==='CAMPANHA'?'border-color:#00f3ff; background:#00f3ff22;':''}" onclick="filterRank('CAMPANHA')">CAMPANHA</button>
      <button style="padding:4px 8px; font-size:0.75rem; ${activeRankFilter==='INFINITO'?'border-color:#00f3ff; background:#00f3ff22;':''}" onclick="filterRank('INFINITO')">INFINITO</button>
    </div>
    <div style="background:#050d1a; border:2px solid #00f3ff44; border-radius:4px; padding:6px; font-family:'Courier New', monospace; font-size:0.78rem;">
      <div style="display:flex; justify-content:space-between; color:#00f3ff; font-weight:bold; border-bottom:1px solid #00f3ff44; padding-bottom:4px; margin-bottom:4px;">
        <span style="width:25px;">POS</span>
        <span style="width:45px;">TAG</span>
        <span style="width:75px; text-align:right;">PTS</span>
        <span style="flex:1; text-align:right;">SETOR / FASE</span>
      </div>
  `;

  list.slice(0, 10).forEach((r, i) => {
    const isTop3 = i < 3;
    const color = i === 0 ? '#ffd700' : (i === 1 ? '#c0c0c0' : (i === 2 ? '#cd7f32' : '#ffffff'));
    html += `
      <div style="display:flex; justify-content:space-between; padding:3px 0; color:${color}; font-weight:${isTop3?'bold':'normal'};">
        <span style="width:25px;">#${i + 1}</span>
        <span style="width:45px; color:#00f3ff;">[${r.tag || 'AAA'}]</span>
        <span style="width:75px; text-align:right;">${r.score.toLocaleString()}</span>
        <span style="flex:1; text-align:right; color:#8ab4ff; font-size:0.72rem;">${r.info || r.mode}</span>
      </div>
    `;
  });

  html += `</div>`;
  el.innerHTML = html;
}

// Inserção de Iniciais (3 Letras)
let pendingScoreData = null;
let currentInitials = ['A', 'A', 'A'];
let activeCharIndex = 0;

function promptInitials(scoreVal, modeVal, infoVal) {
  pendingScoreData = {
    score: scoreVal,
    mode: modeVal,
    info: infoVal,
    date: new Date().toLocaleDateString('pt-BR')
  };
  currentInitials = ['A', 'A', 'A'];
  activeCharIndex = 0;
  updateInitialsDisplay();
  showScreen('screen-initials');
}

function updateInitialsDisplay() {
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById(`init-slot-${i}`);
    if (slot) {
      slot.textContent = currentInitials[i];
      slot.style.borderColor = (i === activeCharIndex) ? '#00f3ff' : '#334466';
      slot.style.boxShadow = (i === activeCharIndex) ? '0 0 12px #00f3ff' : 'none';
    }
  }
}

function shiftChar(delta) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#';
  let curIdx = letters.indexOf(currentInitials[activeCharIndex]);
  if (curIdx === -1) curIdx = 0;
  curIdx = (curIdx + delta + letters.length) % letters.length;
  currentInitials[activeCharIndex] = letters[curIdx];
  updateInitialsDisplay();
}

function nextCharSlot() {
  activeCharIndex = (activeCharIndex + 1) % 3;
  updateInitialsDisplay();
}

function prevCharSlot() {
  activeCharIndex = (activeCharIndex - 1 + 3) % 3;
  updateInitialsDisplay();
}

function submitInitials() {
  const tag = currentInitials.join('');
  if (pendingScoreData) {
    arcadeRankings.push({
      tag: tag,
      score: pendingScoreData.score,
      mode: pendingScoreData.mode,
      info: pendingScoreData.info,
      date: pendingScoreData.date
    });
    arcadeRankings.sort((a, b) => b.score - a.score);
    arcadeRankings = arcadeRankings.slice(0, 20);
    save();
  }
  showScreen('screen-highscore');
}

function updateLifeBar() {
  document.getElementById('life-bar').style.width = Math.max(0, (lives / maxLives) * 100) + '%';
}
function updateBossHp() {
  if (currentBoss) document.getElementById('boss-hp').style.width = Math.max(0, (currentBoss.hp / currentBoss.maxHp) * 100) + '%';
}
function updatePowerUI() {
  document.getElementById('power-uses').textContent = selectedSuper === 'sandevistan' ? '∞' : powerUsesLeft;
}

// ===== SISTEMA DE DRAFT / APOSTA DE CARTAS & REROLL =====
function generateDraft() {
  gameState = 'DRAFT';
  const container = document.getElementById('draft-cards-container');
  if (!container) return;
  container.innerHTML = '';

  let options = [...BOONS].sort(() => Math.random() - 0.5).slice(0, 3);
  options.forEach(b => {
    container.innerHTML += `
      <div class="boon-card" style="border-color: ${b.color}; box-shadow: 0 0 14px ${b.color}55;" onclick="selectBoon('${b.name}')">
        <h3 style="color:${b.color}; margin-bottom: 6px;">${b.name}</h3>
        <p style="color:#aaffaa; font-weight: bold; margin-bottom: 6px;">✔ ACERTO: <span style="color:#fff">${b.desc}</span></p>
        <p style="color:#ff8888; font-size: 0.75rem;">✖ ERRO: Perde a carta + ${b.penaltyDesc || 'Penalidade'}</p>
      </div>`;
  });

  // Botão de Nova Tiragem / Reroll (+2 Perguntas)
  container.innerHTML += `
    <div style="width:100%; text-align:center; margin-top:14px;">
      <button style="border-color:#ffaa00; background:#221500; color:#ffcc00; font-size:0.88rem; padding:8px 18px; border-radius:4px;" onclick="startRerollChallenge()">
        🔄 Não gostou? Faça +2 Questões para Nova Tiragem
      </button>
    </div>`;

  showScreen('screen-draft');
}

function selectBoon(name) {
  const boon = BOONS.find(b => b.name === name);
  if (boon) {
    pendingBoon = boon;
    playSound('super');
  }
  rerollMode = false;
  gameState = 'PLAYING';
  showScreen(null);
  lastTime = performance.now();
  requestAnimationFrame(loop);
  setTimeout(() => {
    if (gameState === 'PLAYING') loadNextQuestion();
  }, 100);
}

function startRerollChallenge() {
  rerollMode = true;
  rerollQuestionsLeft = 2;
  pendingBoon = null;
  gameState = 'PLAYING';
  showScreen(null);
  lastTime = performance.now();
  requestAnimationFrame(loop);
  setTimeout(() => {
    if (gameState === 'PLAYING') loadNextQuestion();
  }, 100);
}