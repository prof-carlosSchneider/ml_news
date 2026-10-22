// ===== SISTEMA DE CHEFÕES (8 BOSSES OFICIAIS & SPRITES ASEPRITE) =====

function startMiniBoss() {
  isMiniBoss = true;
  bossMode = true;
  const phaseIdx = isEndlessMode ? (endlessSector - 1) : currentPhaseIdx;
  const data = BOSS_DATA[phaseIdx % BOSS_DATA.length];

  currentBoss = {
    x: 200,
    y: 35,
    w: data.w,
    h: data.h,
    hp: isEndlessMode ? (450 + endlessSector * 85) : (350 + currentPhaseIdx * 70),
    maxHp: isEndlessMode ? (450 + endlessSector * 85) : (350 + currentPhaseIdx * 70),
    name: 'Sombra de ' + data.name,
    spriteKey: data.spriteKey,
    isMiniBoss: true,
    vx: BOSS_SPEED * 1.1,
    timer: 50,
    attackIndex: 0,
    hitFlash: 0
  };

  document.getElementById('boss-name').textContent = currentBoss.name;
  document.getElementById('boss-name').style.display = 'block';
  document.getElementById('boss-hp-wrap').style.display = 'block';
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('super-bar-container').classList.add('hidden');
  updateBossHp();
  gameState = 'BOSS';
  playSound('clear');
}

function tryBoss(idx) {
  if (phasesDone <= idx && !adminMode) {
    return alert(`Complete a Fase ${idx + 1} para desbloquear este Boss!`);
  }
  startRealBoss(idx);
}

function startRealBoss(idx) {
  initAudio();
  isMiniBoss = false;
  bossMode = true;
  const data = BOSS_DATA[idx % BOSS_DATA.length];

  currentBoss = {
    x: 200,
    y: 35,
    w: data.w,
    h: data.h,
    hp: data.hp,
    maxHp: data.hp,
    name: data.name,
    spriteKey: data.spriteKey,
    isMiniBoss: false,
    vx: BOSS_SPEED,
    timer: 45,
    attackIndex: 0,
    hitFlash: 0
  };

  lives = Math.max(lives, 5);
  maxLives = lives;
  player.x = 220;
  player.y = 280;
  player.invuln = 0;
  player.lastShot = 0;
  clearEntities();
  score = 0;
  shake = 0;

  document.getElementById('score-display').textContent = '0';
  document.getElementById('boss-name').textContent = currentBoss.name;
  document.getElementById('boss-name').style.display = 'block';
  document.getElementById('boss-hp-wrap').style.display = 'block';
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('super-bar-container').classList.remove('hidden');
  updateBossHp();
  updateLifeBar();
  updatePowerUI();

  gameState = 'BOSS';
  showScreen(null);
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function drawBoss(b) {
  const spriteObj = SPRITES.bases[b.spriteKey];
  const hasLoaded = spriteObj && spriteObj.img && spriteObj.img.complete && spriteObj.img.naturalWidth > 0;

  ctx.save();
  // Flutuação suave (Hover)
  const hoverY = Math.sin(performance.now() / 280) * 3;
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2 + hoverY);

  if (b.isMiniBoss) {
    ctx.globalAlpha = 0.82;
  }

  if (hasLoaded) {
    // 1. Rotação 180° para apontar para baixo em direção ao jogador
    ctx.rotate(Math.PI);

    // 2. Animação de Propulsores (Engine Thrust - 8 frames)
    const engObj = SPRITES.engines[b.spriteKey];
    if (engObj && engObj.img && engObj.img.complete && engObj.img.naturalWidth > 0) {
      const frameIdx = Math.floor(performance.now() / 70) % engObj.totalFrames;
      const fw = engObj.frameWidth;
      ctx.drawImage(engObj.img, frameIdx * fw, 0, fw, fw, -b.w / 2, -b.h / 2, b.w, b.h);
    }

    // 3. Casco da Nave (Base Hull)
    ctx.drawImage(spriteObj.img, -b.w / 2, -b.h / 2, b.w, b.h);

    // 4. Escudo de Energia
    const shObj = SPRITES.shields[b.spriteKey];
    if (shObj && shObj.img && shObj.img.complete && shObj.img.naturalWidth > 0) {
      const isLowHp = (b.hp / b.maxHp) < 0.35;
      if (isLowHp || b.isMiniBoss) {
        ctx.globalAlpha = 0.45 + Math.sin(performance.now() / 90) * 0.25;
        ctx.drawImage(shObj.img, 0, 0, shObj.frameWidth, shObj.frameWidth, -b.w / 2 - 4, -b.h / 2 - 4, b.w + 8, b.h + 8);
        ctx.globalAlpha = b.isMiniBoss ? 0.82 : 1.0;
      }
    }

    // 5. Hit Flash (Silhueta branca ao tomar dano)
    if (b.hitFlash && b.hitFlash > 0) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      b.hitFlash--;
    }
  } else {
    // Fallback procedural retro
    ctx.fillStyle = '#223355';
    ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h);
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 9px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(b.name, 0, 4);
  }

  ctx.restore();
}

function bossAttack() {
  if (!currentBoss) return;
  const b = currentBoss;
  const bx = b.x + b.w / 2;
  const by = b.y + b.h - 6;
  const cycle = b.attackIndex % 8;
  b.attackIndex++;

  // Padrões dinâmicos e balanceados para os 8 Chefões
  if (b.name.includes('Specter')) {
    // Specter: Tiros rápidos em leque e investidas
    for (let k = -2; k <= 2; k++) {
      bossBullets.push({
        x: bx + k * 8, y: by,
        vx: k * 0.9, vy: 3.2 + Math.abs(k) * 0.2,
        r: 4, color: '#00f3ff', parry: true
      });
    }
  } else if (b.name.includes('Warden')) {
    // Warden: Esferas defensivas e invocação de drones de suporte
    if (cycle % 3 === 0) {
      for (let k = 0; k < 2; k++) {
        minions.push({ x: bx + (k === 0 ? -25 : 25), y: by, vx: (k === 0 ? -0.8 : 0.8), vy: 1.5, life: 180 });
      }
    } else {
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 5) * k + 0.3;
        bossBullets.push({ x: bx, y: by, vx: Math.cos(a) * 2.8, vy: Math.sin(a) * 2.8, r: 4.5, color: '#00ff88', parry: true });
      }
    }
  } else if (b.name.includes('Odissey')) {
    // Odissey: Mísseis e torpedos balísticos pesados
    for (let k = 0; k < 3; k++) {
      bossBullets.push({
        x: bx + (k - 1) * 20, y: by,
        vx: (k - 1) * 1.2, vy: 2.6,
        w: 10, h: 22, color: '#ffaa00', parry: true, life: 70
      });
    }
  } else if (b.name.includes('Eclipse')) {
    // Eclipse: Bombas de fragmentação e leque amplo de plasma
    for (let k = 0; k < 8; k++) {
      const a = (Math.PI * 2 / 8) * k;
      bossBullets.push({
        x: bx, y: by,
        vx: Math.cos(a) * 3.2, vy: Math.sin(a) * 3.2,
        r: 5, color: '#ff3366', parry: true
      });
    }
  } else if (b.name.includes('Chronos')) {
    // Chronos: Ondas de distorção temporal e espirais
    for (let k = 0; k < 7; k++) {
      const offset = (k - 3) * 0.35;
      bossBullets.push({
        x: bx, y: by,
        vx: Math.sin(cycle + offset) * 2.6, vy: 2.8 + Math.cos(cycle + offset) * 0.8,
        r: 4.5, color: '#bb66ff', parry: true
      });
    }
  } else if (b.name.includes('Infinity')) {
    // Infinity: Feixes contínuos e cruzamentos
    for (let k = 0; k < 6; k++) {
      bossBullets.push({
        x: bx + (k - 2.5) * 14, y: by,
        vx: (player.x + 14 - bx) * 0.012 + (k - 2.5) * 0.4, vy: 3.6,
        r: 4, color: '#00e5ff', parry: true
      });
    }
  } else if (b.name.includes('Leviatã')) {
    // Leviatã: Salvas massivas de cruzador e rajadas laterais
    for (let k = 0; k < 10; k++) {
      const a = (Math.PI / 9) * k + 0.1;
      bossBullets.push({
        x: bx, y: by,
        vx: Math.cos(a) * 3.6, vy: Math.sin(a) * 3.6,
        r: 5, color: '#ff2244', parry: true
      });
    }
    if (cycle % 2 === 0) {
      bossBullets.push({ x: bx - 28, y: by, vx: -0.6, vy: 3.1, w: 14, h: 28, color: '#ff4400', parry: true, life: 60 });
      bossBullets.push({ x: bx + 28, y: by, vx: 0.6, vy: 3.1, w: 14, h: 28, color: '#ff4400', parry: true, life: 60 });
    }
  } else {
    // Oblivion: Titã Supremo - Tempestade de plasma e tempestade cósmica
    for (let k = 0; k < 12; k++) {
      const a = (Math.PI * 2 / 12) * k + (cycle * 0.2);
      bossBullets.push({
        x: bx, y: by,
        vx: Math.cos(a) * 4.0, vy: Math.sin(a) * 4.0,
        r: 5.5, color: '#ff0055', parry: true
      });
    }
    for (let k = -2; k <= 2; k++) {
      bossBullets.push({
        x: bx + k * 18, y: by + 8,
        vx: k * 0.8, vy: 3.5,
        r: 4.5, color: '#ffff00', parry: true
      });
    }
  }
}
