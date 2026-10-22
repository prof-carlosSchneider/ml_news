// ===== HABILIDADES DA NAVE & SISTEMA DE PARRY =====

function doParry() {
  if (gameState !== 'PLAYING' && gameState !== 'BOSS') return;
  const now = performance.now();
  if (now - lastParryTime < 550) return; // Cooldown de 550ms entre tentativas de parry
  lastParryTime = now;
  parryWindow = 13 + (playerStats.parryBonus || 0); // Janela ativa de parry (~220ms)
  parryFlash = 13;
  playSound('slash');

  // Efeito visual de onda de choque de parry
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 / 8) * i;
    particles.push({
      x: player.x + 14,
      y: player.y + 12,
      vx: Math.cos(a) * 3.5,
      vy: Math.sin(a) * 3.5,
      life: 0.4,
      color: '#00f3ff'
    });
  }
}

function activateShield() {
  doParry();
}

function activateSuper() {
  if (superActive) return;
  if (selectedSuper === 'sandevistan') {
    if (!superReady && !adminMode) return;
    superReady = false; superMeter = 0; document.getElementById('super-bar').style.width = '0%';
  } else {
    if (powerUsesLeft <= 0 && !adminMode) return;
    if (!adminMode) powerUsesLeft--; updatePowerUI();
  }
  superActive = true; superTimer = 6; playSound('super'); shake = 6;
  if (selectedSuper === 'sukuna' || selectedSuper === 'theworld') {
    sukunaActive = selectedSuper === 'sukuna'; zaActive = selectedSuper === 'theworld';
    sukunaTransformed = selectedSuper === 'sukuna'; timeScale = selectedSuper === 'sukuna' ? 0.2 : 0.11;
    document.getElementById('za-text').textContent = selectedSuper === 'sukuna' ? 'DOMAIN EXPANSION' : 'ZA WARUDO';
    document.getElementById('za-text').style.opacity = '1';
    setTimeout(() => document.getElementById('za-text').style.opacity = '0', 1500);
  }
  if (selectedSuper === 'sandevistan') timeScale = 0.3;
  if (selectedSuper === 'nova') shieldActive = true;
  if (selectedSuper === 'horizon') enemies.forEach(e => { if (!e.dead) { e.x += (W / 2 - e.x) * 0.32; e.y += (H * 0.3 - e.y) * 0.28; } });
  if (selectedSuper === 'opala') lasers.push({ x: player.x + 14, y: player.y, h: 0, maxH: 310, life: 40, color: 0 });
  if (selectedSuper === 'cereja') cherries.push({ x: player.x + 10, y: player.y - 14, vy: -4.2, giant: true, life: 80, exploded: false });
}

function subAbility(k) {
  if (!sukunaActive && !adminMode) return;
  if (k === 'z') { playSound('slash'); for (let i = 0; i < 7; i++) { const a = -0.8 + (i / 6) * 1.6; slashes.push({ x: player.x + 14, y: player.y, vx: Math.sin(a) * 6.5, vy: -Math.cos(a) * 6.5, life: 42, type: 'd', len: 16 }); } }
  if (k === 'x') { playSound('slash'); const w = enemies.filter(e => !e.dead && !e.isCorrect); if (!w.length) for (let i = 0; i < 4; i++) slashes.push({ x: player.x + 10 + i * 8, y: player.y, vx: 0, vy: -7, life: 48, type: 'c', len: 18 }); else w.forEach(t => { const dx = t.x + 32 - player.x - 14, dy = t.y + 11 - player.y, d = Math.hypot(dx, dy) || 1; slashes.push({ x: player.x + 14, y: player.y, vx: (dx / d) * 7, vy: (dy / d) * 7, life: 52, type: 'c', len: 20 }); }); }
  if (k === 'c') {
    playSound('slash'); document.getElementById('za-text').textContent = 'MALEVOLENT SHRINE'; document.getElementById('za-text').style.opacity = '1'; setTimeout(() => document.getElementById('za-text').style.opacity = '0', 900);
    for (let i = 0; i < 12; i++) slashes.push({ x: Math.random() * W, y: -20 - Math.random() * 35, vx: (Math.random() - 0.5) * 1.2, vy: 4.2 + Math.random() * 2, life: 75, type: 's', len: 22 });
    enemies.forEach(e => { if (!e.isCorrect && !e.dead) { e.dead = true; for (let k = 0; k < 5; k++) particles.push({ x: e.x + 32, y: e.y + 11, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 1, color: '#f44' }); } });
  }
}
