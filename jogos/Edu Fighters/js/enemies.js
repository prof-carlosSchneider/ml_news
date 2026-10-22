// ===== SISTEMA DE INIMIGOS (Top-down Shmup Arcade & Waves) =====

function spawnCombatWave(waveNum, phaseIdx) {
  enemies = [];
  enemyBullets = [];
  inQuestionWave = false;

  const difficultyMultiplier = 1 + (isEndlessMode ? (endlessSector * 0.12) : ((phaseIdx || 0) * 0.15));

  if (waveNum === 1) {
    // Wave 1: Formação em V com Grunts
    for (let i = 0; i < 4; i++) {
      const isLeft = i % 2 === 0;
      const rank = Math.floor(i / 2);
      const startX = isLeft ? (W / 2 - 40 - rank * 50) : (W / 2 + 40 + rank * 50);
      enemies.push(createEnemy({
        x: startX, y: -30 - rank * 30, text: '', isEscort: true,
        type: 'grunt', pattern: 'v_formation',
        baseVx: isLeft ? -0.4 : 0.4, vy: ENEMY_SPEED * 0.85 * difficultyMultiplier,
        shootTimer: 70 + i * 25
      }));
    }
  } else if (waveNum === 2) {
    // Wave 2: Esquadrão Ágil em Onda Senoidal (Zigzags)
    for (let i = 0; i < 5; i++) {
      const startX = 35 + i * 85;
      enemies.push(createEnemy({
        x: startX, y: -35 - (i % 2) * 25, text: '', isEscort: true,
        type: 'zigzag', pattern: 'sweep_sine',
        sineOffset: i * 1.3, vy: ENEMY_SPEED * 0.95 * difficultyMultiplier,
        shootTimer: 60 + i * 20
      }));
    }
  } else if (waveNum === 3) {
    // Wave 3: Snipers com escolta de Kamikazes
    enemies.push(createEnemy({
      x: 80, y: -40, text: '', isEscort: true, type: 'sniper', pattern: 'echelon',
      vy: ENEMY_SPEED * 0.7 * difficultyMultiplier, shootTimer: 50
    }));
    enemies.push(createEnemy({
      x: W - 130, y: -40, text: '', isEscort: true, type: 'sniper', pattern: 'echelon',
      vy: ENEMY_SPEED * 0.7 * difficultyMultiplier, shootTimer: 70
    }));
    for (let k = 0; k < 2; k++) {
      enemies.push(createEnemy({
        x: W / 2 - 30 + k * 60, y: -70 - k * 35, text: '', isEscort: true,
        type: 'kamikaze', pattern: 'staggered',
        vy: ENEMY_SPEED * 1.15 * difficultyMultiplier, shootTimer: 999
      }));
    }
  } else if (waveNum === 4) {
    // Wave 4: Bombardeiros Pesados (Shield Grunts) + Caças de Suporte
    enemies.push(createEnemy({
      x: W / 2 - 70, y: -50, text: '', isEscort: true, type: 'shield_grunt',
      pattern: 'sweep_sine', sineOffset: 0, vy: ENEMY_SPEED * 0.65 * difficultyMultiplier, shootTimer: 45
    }));
    enemies.push(createEnemy({
      x: W / 2 + 30, y: -50, text: '', isEscort: true, type: 'shield_grunt',
      pattern: 'sweep_sine', sineOffset: Math.PI, vy: ENEMY_SPEED * 0.65 * difficultyMultiplier, shootTimer: 65
    }));
    for (let k = 0; k < 3; k++) {
      enemies.push(createEnemy({
        x: 40 + k * 180, y: -80 - k * 20, text: '', isEscort: true,
        type: 'zigzag', pattern: 'v_formation', baseVx: (k - 1) * 0.5,
        vy: ENEMY_SPEED * 1.0 * difficultyMultiplier, shootTimer: 55 + k * 30
      }));
    }
  } else {
    // Wave 5: Ataque de Enxame Completo antes da Pergunta
    for (let i = 0; i < 6; i++) {
      const types = ['grunt', 'zigzag', 'sniper', 'kamikaze'];
      enemies.push(createEnemy({
        x: 30 + i * 70, y: -30 - (i % 3) * 25, text: '', isEscort: true,
        type: types[i % types.length], pattern: i % 2 === 0 ? 'sweep_sine' : 'v_formation',
        sineOffset: i, baseVx: (i % 2 === 0 ? 0.4 : -0.4),
        vy: ENEMY_SPEED * 0.9 * difficultyMultiplier, shootTimer: 40 + i * 20
      }));
    }
  }
}

function spawnQuestionFormation(question) {
  enemies = [];
  enemyBullets = [];
  inQuestionWave = true;

  const opts = [...question.o].sort(() => Math.random() - 0.5);
  const patterns = ['v_formation', 'sweep_sine', 'echelon', 'staggered'];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  if (pattern === 'v_formation') {
    opts.forEach((text, i) => {
      const isLeft = i % 2 === 0;
      const rank = Math.floor(i / 2);
      const startX = isLeft ? (W / 2 - 45 - rank * 60) : (W / 2 + 45 + rank * 60);
      const startY = -40 - rank * 35;
      enemies.push(createEnemy({
        x: startX, y: startY, text, isCorrect: text === question.c,
        type: i === 0 ? 'shield_grunt' : (rank === 0 ? 'grunt' : 'zigzag'),
        pattern: 'v_formation', baseVx: isLeft ? -0.4 : 0.4, vy: ENEMY_SPEED * 0.85,
        shootTimer: 75 + i * 25
      }));
    });
  } else if (pattern === 'sweep_sine') {
    const sp = W / (opts.length + 1);
    opts.forEach((text, i) => {
      enemies.push(createEnemy({
        x: sp * (i + 1) - 24, y: -35 - (i % 2) * 25, text, isCorrect: text === question.c,
        type: i % 2 === 0 ? 'zigzag' : 'grunt',
        pattern: 'sweep_sine', sineOffset: i * 1.5, vy: ENEMY_SPEED * 0.75,
        shootTimer: 60 + i * 25
      }));
    });
  } else if (pattern === 'echelon') {
    opts.forEach((text, i) => {
      enemies.push(createEnemy({
        x: 40 + i * 85, y: -30 - i * 35, text, isCorrect: text === question.c,
        type: i === 3 ? 'sniper' : 'grunt',
        pattern: 'echelon', vy: ENEMY_SPEED * 0.8,
        shootTimer: 70 + i * 20
      }));
    });
  } else {
    const sp = W / opts.length;
    opts.forEach((text, i) => {
      enemies.push(createEnemy({
        x: sp * i + (sp - 56) / 2, y: -45 - Math.random() * 20, text, isCorrect: text === question.c,
        type: Math.random() < 0.4 ? 'kamikaze' : 'grunt',
        pattern: 'staggered', vy: ENEMY_SPEED * 0.8,
        shootTimer: 80 + i * 25
      }));
    });
  }

  // 2 Caças de escolta
  for (let k = 0; k < 2; k++) {
    enemies.push(createEnemy({
      x: (k === 0 ? 30 : W - 50) + (Math.random() - 0.5) * 20,
      y: -60 - k * 40, text: '', isCorrect: false, isEscort: true,
      type: 'zigzag', pattern: 'sweep_sine', sineOffset: k * 3,
      vy: ENEMY_SPEED * 1.1, shootTimer: 50 + k * 40
    }));
  }
}

function createEnemy(config) {
  const isHeavy = config.type === 'shield_grunt';
  return {
    x: config.x || 0,
    y: config.y || 0,
    w: isHeavy ? 64 : 52,
    h: isHeavy ? 30 : 26,
    text: config.text || '',
    isCorrect: !!config.isCorrect,
    isEscort: !!config.isEscort,
    type: config.type || 'grunt',
    pattern: config.pattern || 'v_formation',
    hp: isHeavy ? 3 : (config.isEscort ? 1 : 2),
    maxHp: isHeavy ? 3 : (config.isEscort ? 1 : 2),
    vx: config.baseVx || 0,
    vy: config.vy || ENEMY_SPEED,
    sineOffset: config.sineOffset || Math.random() * 5,
    shootTimer: config.shootTimer || 80,
    hitFlash: 0,
    dead: false
  };
}

function isWaveCleared() {
  return enemies.every(e => e.dead);
}

function updateAllEnemies(t, dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.dead) continue;

    if (e.hitFlash > 0) e.hitFlash--;

    if (e.pattern === 'sweep_sine') {
      e.y += e.vy * timeScale;
      e.x += Math.sin(t / 400 + e.sineOffset) * 1.8 * timeScale;
    } else if (e.pattern === 'v_formation') {
      e.y += e.vy * timeScale;
      e.x += e.vx * timeScale;
      if (e.x < 15 || e.x > W - e.w - 15) e.vx *= -1;
    } else if (e.pattern === 'echelon') {
      e.y += e.vy * timeScale;
      e.x += Math.cos(t / 500 + e.x) * 1.1 * timeScale;
    } else if (e.type === 'kamikaze') {
      if (e.y < 90) {
        e.y += e.vy * 0.7 * timeScale;
        e.x += (player.x + 14 - (e.x + e.w / 2)) * 0.02 * timeScale;
      } else {
        e.y += (e.vy + 1.6) * timeScale;
      }
    } else {
      e.y += e.vy * timeScale;
      e.x += (Math.random() - 0.5) * 0.4 * timeScale;
    }

    e.x = Math.max(2, Math.min(W - e.w - 2, e.x));

    // 1. COLISÃO FÍSICA DO INIMIGO COM O JOGADOR (BODY-TO-BODY RAMMING)
    const enemyCx = e.x + e.w / 2;
    const enemyCy = e.y + e.h / 2;
    const playerCx = player.x + 14;
    const playerCy = player.y + 12;
    const collisionDist = Math.hypot(enemyCx - playerCx, enemyCy - playerCy);

    if (collisionDist < 20) {
      if (parryWindow > 0) {
        document.getElementById('parry-shine').style.opacity = '0.55';
        setTimeout(() => document.getElementById('parry-shine').style.opacity = '0', 90);
        score += 30;
        coins += 3;
        e.dead = true;
        playSound('hit');
        shake = 6;
        checkRally();
      } else if (shieldActive) {
        e.dead = true;
        playSound('hit');
        shake = 4;
        checkRally();
      } else if (player.invuln <= 0 && !adminMode) {
        e.dead = true;
        player.invuln = 32;
        lastDamageTime = performance.now();
        recoverableHealth = 0.5;
        floatingTexts.push({ x: player.x, y: player.y - 15, life: 1.2, text: '💥 COLISÃO!', color: '#ff4444' });
        loseLife('Colisão com inimigo');
      }

      // Efeito visual de explosão da nave colidida
      for (let k = 0; k < 12; k++) {
        particles.push({
          x: enemyCx, y: enemyCy,
          vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
          life: 0.9, color: '#ff6600'
        });
      }
      continue;
    }

    // IA de Disparo
    e.shootTimer -= (1 * timeScale);
    if (e.shootTimer <= 0 && e.y > 10 && e.y < H - 75) {
      enemyShoot(e);
      e.shootTimer = 100 + Math.random() * 70;
    }

    // 2. PENALIDADE QUANDO QUALQUER INIMIGO PASSA DO LIMITE INFERIOR DA TELA
    if (e.y > H + 10) {
      e.dead = true;
      if (!adminMode) {
        lastDamageTime = performance.now();
        recoverableHealth = 0.5;
        floatingTexts.push({ x: Math.max(20, Math.min(W - 80, e.x)), y: H - 25, life: 1.4, text: '⚠ ESCAPOU (-1 VIDA)', color: '#ff4444' });
        loseLife('Inimigo escapou');
      }
    }
  }
}

function enemyShoot(e) {
  const cx = e.x + e.w / 2;
  const cy = e.y + e.h;

  if (e.type === 'shield_grunt') {
    for (let k = -1; k <= 1; k++) {
      enemyBullets.push({
        x: cx + k * 8, y: cy, vx: k * 1.1, vy: 2.1, r: 4, color: '#ff3366', parry: true
      });
    }
  } else if (e.type === 'zigzag') {
    enemyBullets.push({ x: cx - 6, y: cy, vx: 0, vy: 2.5, r: 3.5, color: '#ffcc00', parry: true });
    enemyBullets.push({ x: cx + 6, y: cy, vx: 0, vy: 2.5, r: 3.5, color: '#ffcc00', parry: true });
  } else if (e.type === 'sniper') {
    const dx = (player.x + 14) - cx;
    const dy = (player.y + 12) - cy;
    const dist = Math.hypot(dx, dy) || 1;
    enemyBullets.push({
      x: cx, y: cy, vx: (dx / dist) * 3.2, vy: (dy / dist) * 3.2, r: 4.5, color: '#00ffff', parry: true
    });
  } else {
    enemyBullets.push({
      x: cx, y: cy, vx: (Math.random() - 0.5) * 0.5, vy: 2.0, r: 3.5, color: '#ff4444', parry: true
    });
  }
}

function drawAllEnemies(t) {
  enemies.forEach(e => {
    if (e.dead) return;

    ctx.save();
    ctx.translate(e.x, e.y);

    if (e.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
    } else if (e.type === 'shield_grunt') {
      ctx.fillStyle = '#1e3a1e';
    } else if (e.type === 'zigzag') {
      ctx.fillStyle = '#1a2a4e';
    } else if (e.type === 'sniper') {
      ctx.fillStyle = '#3a1a4e';
    } else if (e.type === 'kamikaze') {
      ctx.fillStyle = '#4e1a1a';
    } else {
      ctx.fillStyle = '#2a1a3e';
    }

    ctx.beginPath();
    if (e.type === 'shield_grunt') {
      ctx.fillRect(4, 2, e.w - 8, e.h - 6);
      ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
      ctx.strokeRect(4, 2, e.w - 8, e.h - 6);
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(8, e.h - 4, 5, 4);
      ctx.fillRect(e.w - 13, e.h - 4, 5, 4);
    } else if (e.type === 'zigzag') {
      ctx.moveTo(e.w / 2, e.h);
      ctx.lineTo(2, 4);
      ctx.lineTo(e.w / 2, 10);
      ctx.lineTo(e.w - 2, 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 1.2; ctx.stroke();
    } else if (e.type === 'sniper') {
      ctx.fillRect(6, 4, e.w - 12, e.h - 8);
      ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 1.5;
      ctx.strokeRect(6, 4, e.w - 12, e.h - 8);
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(e.w / 2 - 2, e.h - 4, 4, 6);
    } else {
      ctx.moveTo(e.w / 2, e.h);
      ctx.lineTo(4, 2);
      ctx.lineTo(e.w - 4, 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = e.type === 'kamikaze' ? '#ff3333' : '#ff44aa';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Fogo do motor
    ctx.fillStyle = (Math.sin(t / 50 + e.x) > 0) ? '#ff9900' : '#ff3300';
    ctx.fillRect(e.w / 2 - 3, -4, 6, 4);

    // Texto da Resposta (se houver)
    if (e.text) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.text, e.w / 2, e.h / 2);
    }

    ctx.restore();
  });
}