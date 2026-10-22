function clearEntities() {
  bullets = [];
  enemies = [];
  enemyBullets = [];
  bossBullets = [];
  particles = [];
  minions = [];
  slashes = [];
  cherries = [];
  lasers = [];
  afterimages = [];
  floatingTexts = [];
}

// ===== SISTEMA DE RALLY / REGAIN =====
function checkRally() {
  if (recoverableHealth > 0 && (performance.now() - lastDamageTime <= 1000)) {
    const gained = recoverableHealth;
    lives = Math.min(maxLives, +(lives + gained).toFixed(2));
    recoverableHealth = 0;
    updateLifeBar();
    floatingTexts.push({
      x: player.x + 14,
      y: player.y - 15,
      life: 1.2,
      text: `+${gained} RALLY!`,
      color: '#00ff88'
    });
    for (let k = 0; k < 8; k++) {
      particles.push({
        x: player.x + 14,
        y: player.y + 12,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 0.8,
        color: '#00ff88'
      });
    }
  }
}

function startPhase(idx) {
  if (idx > 0 && phasesDone < idx && !adminMode) return alert('Complete a fase anterior');
  initAudio();
  isEndlessMode = false;
  currentPhaseIdx = idx;
  currentPhaseData = PHASES[idx];
  theme = (currentPhaseData && currentPhaseData.theme) ? currentPhaseData.theme : 'space';
  qIndex = 0;
  bossMode = false;
  isMiniBoss = false;
  maxLives = 4 + shopLife;
  lives = maxLives;
  powerUsesLeft = 3;
  score = 0;
  superMeter = 0;
  superReady = false;
  superActive = false;
  zaActive = false;
  sukunaActive = false;
  sukunaTransformed = false;
  timeScale = 1;
  shieldActive = false;
  shake = 0;

  player.x = 220;
  player.y = 280;
  player.invuln = 0;
  player.lastShot = 0;

  playerStats = {
    damage: 1,
    fireRate: 350,
    multiShot: 1,
    bounce: 0,
    lifesteal: 0,
    pierce: false,
    moveSpeed: 2.2,
    parryBonus: 0
  };
  activeBoons = [];
  pendingBoon = null;

  currentWave = 1;
  totalWavesCleared = 0;
  inQuestionWave = false;
  rerollMode = false;
  rerollQuestionsLeft = 0;
  lastDamageTime = 0;
  recoverableHealth = 0;
  parryWindow = 0;
  parryFlash = 0;

  clearEntities();
  document.getElementById('score-display').textContent = '0';
  document.getElementById('phase-display').textContent = (idx + 1);
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('super-bar-container').classList.remove('hidden');
  document.getElementById('boss-name').style.display = 'none';
  document.getElementById('boss-hp-wrap').style.display = 'none';
  updateLifeBar();
  updatePowerUI();

  gameState = 'PLAYING';
  showScreen(null);
  spawnNextWave();

  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function startEndless() {
  initAudio();
  isEndlessMode = true;
  endlessSector = 1;
  currentPhaseIdx = 0;
  theme = 'space';
  bossMode = false;
  isMiniBoss = false;
  maxLives = 4 + shopLife;
  lives = maxLives;
  powerUsesLeft = 3;
  score = 0;
  superMeter = 0;
  superReady = false;
  superActive = false;
  zaActive = false;
  sukunaActive = false;
  sukunaTransformed = false;
  timeScale = 1;
  shieldActive = false;
  shake = 0;

  player.x = 220;
  player.y = 280;
  player.invuln = 0;
  player.lastShot = 0;

  playerStats = {
    damage: 1,
    fireRate: 350,
    multiShot: 1,
    bounce: 0,
    lifesteal: 0,
    pierce: false,
    moveSpeed: 2.2,
    parryBonus: 0
  };
  activeBoons = [];
  pendingBoon = null;

  currentWave = 1;
  totalWavesCleared = 0;
  inQuestionWave = false;
  rerollMode = false;
  rerollQuestionsLeft = 0;
  lastDamageTime = 0;
  recoverableHealth = 0;
  parryWindow = 0;
  parryFlash = 0;

  clearEntities();
  document.getElementById('score-display').textContent = '0';
  document.getElementById('phase-display').textContent = '∞';
  document.getElementById('hud').classList.remove('hidden');
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('super-bar-container').classList.remove('hidden');
  document.getElementById('boss-name').style.display = 'none';
  document.getElementById('boss-hp-wrap').style.display = 'none';
  updateLifeBar();
  updatePowerUI();

  gameState = 'PLAYING';
  showScreen(null);
  spawnNextWave();

  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function spawnNextWave() {
  inQuestionWave = false;
  document.getElementById('question-box').classList.add('hidden');

  if (isEndlessMode) {
    document.getElementById('q-display').textContent = `Setor ${endlessSector} • W${currentWave}/5`;
    document.getElementById('phase-display').textContent = `S${endlessSector}`;
  } else {
    document.getElementById('q-display').textContent = `Wave ${currentWave}/5`;
    document.getElementById('phase-display').textContent = (currentPhaseIdx + 1);
  }

  if (currentWave <= 5) {
    spawnCombatWave(currentWave, isEndlessMode ? endlessSector : currentPhaseIdx);
    floatingTexts.push({
      x: W / 2,
      y: H / 2 - 20,
      life: 1.2,
      text: isEndlessMode ? `SETOR ${endlessSector} - WAVE ${currentWave}/5` : `WAVE ${currentWave}/5`,
      color: '#00f3ff'
    });
  } else {
    generateDraft();
  }
}

function loadNextQuestion() {
  inQuestionWave = true;
  document.getElementById('question-box').classList.remove('hidden');

  if (rerollMode) {
    if (isEndlessMode) {
      currentQuestion = generateProceduralQuestion(endlessSector);
    } else {
      const allQuestions = PHASES[currentPhaseIdx].questions;
      currentQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }
    document.getElementById('question-box').innerHTML = `<span style="color:#ffaa00;">[Reroll ${3 - rerollQuestionsLeft}/2]</span> ${currentQuestion.q}`;
    document.getElementById('q-display').textContent = `Reroll ${3 - rerollQuestionsLeft}/2`;
  } else if (isEndlessMode) {
    currentQuestion = generateProceduralQuestion(endlessSector);
    document.getElementById('question-box').innerHTML = `<span style="color:#00f3ff;">[Setor ${endlessSector}]</span> ${currentQuestion.q}`;
    document.getElementById('q-display').textContent = `Setor ${endlessSector} • Desafio`;
  } else {
    if (!currentPhaseData || qIndex >= currentPhaseData.questions.length) {
      startMiniBoss();
      return;
    }
    currentQuestion = currentPhaseData.questions[qIndex];
    document.getElementById('question-box').textContent = currentQuestion.q;
    document.getElementById('q-display').textContent = `Pergunta ${qIndex + 1}/${currentPhaseData.questions.length}`;
  }

  spawnQuestionFormation(currentQuestion);
}

function onCorrect() {
  score += 15;
  document.getElementById('score-display').textContent = score;

  if (selectedSuper === 'sandevistan') {
    superMeter = Math.min(100, superMeter + 18);
    document.getElementById('super-bar').style.width = superMeter + '%';
    if (superMeter >= 100) superReady = true;
  }

  coins += 4;
  updateUI();
  playSound('hit');
  shake = 5;
  checkRally();

  for (let k = 0; k < 16; k++) {
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 60,
      y: H * 0.38,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 1,
      life: 1,
      color: k % 2 ? '#00ff88' : '#00f3ff'
    });
  }

  if (rerollMode) {
    rerollQuestionsLeft--;
    floatingTexts.push({
      x: player.x,
      y: player.y - 12,
      life: 1.3,
      text: `✔ DESAFIO ${2 - rerollQuestionsLeft}/2 OK`,
      color: '#ffcc00'
    });

    setTimeout(() => {
      if (gameState === 'PLAYING') {
        enemies = [];
        enemyBullets = [];
        if (rerollQuestionsLeft > 0) {
          loadNextQuestion();
        } else {
          rerollMode = false;
          floatingTexts.push({ x: W / 2, y: H / 2, life: 1.5, text: '🎉 NOVA TIRAGEM!', color: '#00ff88' });
          generateDraft();
        }
      }
    }, Q_TRANSITION);
  } else {
    if (pendingBoon) {
      pendingBoon.apply(playerStats);
      activeBoons.push(pendingBoon.name);
      floatingTexts.push({
        x: player.x,
        y: player.y - 12,
        life: 1.4,
        text: '✔ ' + pendingBoon.name,
        color: pendingBoon.color
      });
      pendingBoon = null;
    }

    if (isEndlessMode) {
      endlessSector++;
      const themes = ['space', 'nebula', 'aurora', 'crystal', 'blackhole'];
      theme = themes[(endlessSector - 1) % themes.length];

      setTimeout(() => {
        if (gameState === 'PLAYING') {
          enemies = [];
          enemyBullets = [];
          if (endlessSector % 5 === 0) {
            startMiniBoss();
          } else {
            currentWave = 1;
            spawnNextWave();
          }
        }
      }, Q_TRANSITION);
    } else {
      qIndex++;
      setTimeout(() => {
        if (gameState === 'PLAYING') {
          enemies = [];
          enemyBullets = [];
          if (qIndex >= currentPhaseData.questions.length) {
            startMiniBoss();
          } else {
            currentWave = 1;
            spawnNextWave();
          }
        }
      }, Q_TRANSITION);
    }
  }
}

function loseLife(r) {
  if (adminMode || shieldActive) return;

  lives--;
  lastDamageTime = performance.now();
  recoverableHealth = 0.5;

  playSound('wrong');
  updateLifeBar();
  shake = 8;

  if (rerollMode) {
    rerollMode = false;
    rerollQuestionsLeft = 0;
    pendingBoon = null;
    floatingTexts.push({
      x: player.x,
      y: player.y - 12,
      life: 1.5,
      text: '✖ DESAFIO FALHOU',
      color: '#ff4444'
    });

    if (lives <= 0) {
      endGame(false, r);
    } else if (isEndlessMode) {
      endlessSector++;
      currentWave = 1;
      setTimeout(spawnNextWave, Q_TRANSITION);
    } else {
      qIndex++;
      if (qIndex >= currentPhaseData.questions.length) {
        setTimeout(startMiniBoss, Q_TRANSITION);
      } else {
        currentWave = 1;
        setTimeout(spawnNextWave, Q_TRANSITION);
      }
    }
  } else if (inQuestionWave) {
    if (pendingBoon) {
      pendingBoon.penalty(playerStats);
      floatingTexts.push({
        x: player.x,
        y: player.y - 12,
        life: 1.5,
        text: '✖ PERDEU A ESCOLHA',
        color: '#ff4444'
      });
      pendingBoon = null;
    }

    if (lives <= 0) {
      endGame(false, r);
    } else if (isEndlessMode) {
      endlessSector++;
      currentWave = 1;
      setTimeout(spawnNextWave, Q_TRANSITION);
    } else {
      qIndex++;
      if (qIndex >= currentPhaseData.questions.length) {
        setTimeout(startMiniBoss, Q_TRANSITION);
      } else {
        currentWave = 1;
        setTimeout(spawnNextWave, Q_TRANSITION);
      }
    }
  } else {
    if (lives <= 0) {
      endGame(false, r);
    }
  }
}

function endGame(win, msg) {
  gameState = 'MENU';
  timeScale = 1;
  zaActive = false;
  sukunaActive = false;
  sukunaTransformed = false;
  shake = 0;

  const modeLabel = isEndlessMode ? 'Infinito' : 'Campanha';
  const infoLabel = isEndlessMode ? (`Setor ${endlessSector}`) : (`Fase ${currentPhaseIdx + 1}`);

  if (win) {
    if (isMiniBoss) {
      if (isEndlessMode) {
        coins += 60;
        score += 150;
        save();
        floatingTexts.push({ x: W / 2, y: H / 2, life: 1.6, text: '🏆 MINI-BOSS DERROTADO! +60 🪙', color: '#00ff88' });
        setTimeout(() => {
          bossMode = false;
          isMiniBoss = false;
          currentWave = 1;
          document.getElementById('boss-name').style.display = 'none';
          document.getElementById('boss-hp-wrap').style.display = 'none';
          gameState = 'PLAYING';
          showScreen(null);
          spawnNextWave();
          lastTime = performance.now();
          requestAnimationFrame(loop);
        }, 1200);
        return;
      } else {
        phasesDone = Math.max(phasesDone, currentPhaseIdx + 1);
        coins += 60;
        save();
        document.getElementById('phase-msg').textContent = `Fase ${currentPhaseIdx + 1} completa! +60 moedas`;
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('question-box').classList.add('hidden');
        document.getElementById('super-bar-container').classList.add('hidden');
        document.getElementById('boss-name').style.display = 'none';
        document.getElementById('boss-hp-wrap').style.display = 'none';
        showScreen('screen-phaseclear');
        return;
      }
    } else {
      coins += 120;
      const bossUnlockMap = {
        'Specter': 'nova',
        'Warden': 'horizon',
        'Odissey': 'opala',
        'Eclipse': 'cereja',
        'Chronos': 'theworld',
        'Infinity': 'sukuna',
        'Leviatã': 'sukuna',
        'Oblivion': 'theworld'
      };
      const unlock = currentBoss ? bossUnlockMap[currentBoss.name] : null;
      if (unlock && !unlockedPowers.includes(unlock)) {
        unlockedPowers.push(unlock);
        msg = (msg || '') + ' | Poder: ' + unlock;
      }
      save();
      document.getElementById('end-title').textContent = 'VITÓRIA';
      document.getElementById('end-title').style.color = '#00ff88';
      document.getElementById('end-msg').textContent = (msg || '') + ' +120 moedas';
    }
  } else {
    document.getElementById('end-title').textContent = 'FIM DE JOGO';
    document.getElementById('end-title').style.color = '#ff4444';
    document.getElementById('end-msg').textContent = msg || 'Fim';
  }

  document.getElementById('final-score').textContent = score;
  document.getElementById('hud').classList.add('hidden');
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('super-bar-container').classList.add('hidden');
  document.getElementById('boss-name').style.display = 'none';
  document.getElementById('boss-hp-wrap').style.display = 'none';

  promptInitials(score, modeLabel, infoLabel);
}

function drawBackground(t) {
  if (theme === 'space') {
    ctx.fillStyle = '#050510'; ctx.fillRect(-12, -12, W + 24, H + 24);
    for (let i = 0; i < 4; i++) {
      const g = ctx.createRadialGradient((i * 120 + t / 50) % W, 80 + i * 40, 0, (i * 120 + t / 50) % W, 80 + i * 40, 70);
      g.addColorStop(0, `hsla(${200 + i * 40},60%,40%,0.08)`); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  } else if (theme === 'nebula') {
    ctx.fillStyle = '#0c0618'; ctx.fillRect(-12, -12, W + 24, H + 24);
    for (let i = 0; i < 6; i++) {
      const x = (i * 95 + t / 40) % (W + 60) - 30, y = 40 + i * 45 + Math.sin(t / 500 + i) * 15;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 55 + i * 8);
      g.addColorStop(0, `hsla(${270 + i * 18},70%,45%,0.14)`); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 60 + i * 8, 0, Math.PI * 2); ctx.fill();
    }
  } else if (theme === 'aurora') {
    ctx.fillStyle = '#060e1c'; ctx.fillRect(-12, -12, W + 24, H + 24);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-12, 50 + i * 28);
      for (let x = 0; x <= W + 12; x += 20) {
        const y = 55 + i * 28 + Math.sin(t / 400 + x / 80 + i) * 28 + Math.sin(t / 600 + x / 40) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 12, H + 12); ctx.lineTo(-12, H + 12); ctx.closePath();
      ctx.fillStyle = `hsla(${140 + i * 28},75%,50%,0.09)`; ctx.fill();
    }
  } else if (theme === 'crystal') {
    ctx.fillStyle = '#08081a'; ctx.fillRect(-12, -12, W + 24, H + 24);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 14; i++) {
      const x = (i * 55 + t / 30) % (W + 40) - 20;
      ctx.strokeStyle = `hsla(200,80%,60%,${0.15 + Math.sin(t / 300 + i) * 0.1})`;
      ctx.beginPath(); ctx.moveTo(x, -12); ctx.lineTo(x + 28, H + 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 40, -12); ctx.lineTo(x + 10, H + 12); ctx.stroke();
    }
  } else if (theme === 'blackhole') {
    ctx.fillStyle = '#04040c'; ctx.fillRect(-12, -12, W + 24, H + 24);
    const cx = W / 2, cy = H * 0.28, r = 42 + Math.sin(t / 450) * 5;
    for (let i = 5; i >= 0; i--) {
      ctx.strokeStyle = `hsla(${30 + i * 15},90%,55%,${0.12 + i * 0.03})`;
      ctx.lineWidth = 3 + i;
      ctx.beginPath(); ctx.ellipse(cx, cy, r + 18 + i * 10, (r + 18 + i * 10) * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = '#050510'; ctx.fillRect(-12, -12, W + 24, H + 24);
  }

  if (theme !== 'blackhole') {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 40; i++) {
      const tw = 0.2 + Math.sin(t / 350 + i * 1.7) * 0.35;
      ctx.globalAlpha = Math.max(0.1, tw);
      const sz = i % 5 === 0 ? 2 : 1;
      ctx.fillRect((i * 79 + t / 25) % W, (i * 53 + Math.sin(i) * 20) % H, sz, sz);
    }
    ctx.globalAlpha = 1;
  }
}

function loop(t) {
  if (gameState !== 'PLAYING' && gameState !== 'BOSS') return;
  const dt = Math.min((t - lastTime) / 1000, 0.045);
  lastTime = t;

  let sx = 0, sy = 0;
  if (shake > 0) {
    sx = (Math.random() - 0.5) * shake;
    sy = (Math.random() - 0.5) * shake;
    shake *= 0.88;
    if (shake < 0.4) shake = 0;
  }

  ctx.save();
  ctx.translate(sx, sy);
  drawBackground(t);

  // Movimentação da Nave
  const currentSpeed = playerStats.moveSpeed || MOVE_SPEED;
  if (keys['KeyA'] || keys['ArrowLeft']) player.x -= currentSpeed;
  if (keys['KeyD'] || keys['ArrowRight']) player.x += currentSpeed;
  if (keys['KeyW'] || keys['ArrowUp']) player.y -= currentSpeed;
  if (keys['KeyS'] || keys['ArrowDown']) player.y += currentSpeed;
  player.x = Math.max(0, Math.min(W - 28, player.x));
  player.y = Math.max(48, Math.min(H - 28, player.y));

  // Carregamento de Super
  if (selectedSuper === 'sandevistan' && !superActive && gameState === 'PLAYING') {
    superMeter = Math.min(100, superMeter + dt * SUPER_FILL);
    document.getElementById('super-bar').style.width = superMeter + '%';
    if (superMeter >= 100) superReady = true;
  }

  // Afterimages
  if ((selectedSuper === 'sandevistan' || sukunaTransformed) && superActive && Math.random() < 0.4) {
    afterimages.push({ x: player.x, y: player.y, life: 0.48, color: sukunaTransformed ? '#ff2222' : '#00f3ff' });
  }
  for (let i = afterimages.length - 1; i >= 0; i--) {
    const a = afterimages[i];
    a.life -= 0.032;
    ctx.globalAlpha = a.life * 0.38;
    ctx.fillStyle = a.color;
    ctx.fillRect(a.x + 2, a.y + 5, 22, 11);
    ctx.globalAlpha = 1;
    if (a.life <= 0) afterimages.splice(i, 1);
  }

  // Indicador visual de janela de Rally ativa (efeito de pulso verde na nave)
  const isRallyActive = recoverableHealth > 0 && (performance.now() - lastDamageTime <= 1000);
  if (isRallyActive) {
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6 + Math.sin(t / 40) * 0.4;
    ctx.strokeRect(player.x - 2, player.y - 2, 32, 28);
    ctx.globalAlpha = 1;
  }

  // Efeito visual de Parry ativo
  if (parryFlash > 0) {
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(player.x + 14, player.y + 12, 22 + (13 - parryFlash) * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    parryFlash--;
  }

  // Desenho da Nave do Jogador
  ctx.fillStyle = sukunaTransformed ? '#ee2222' : '#00f3ff';
  ctx.fillRect(player.x + 7, player.y, 12, 5);
  ctx.fillRect(player.x + 2, player.y + 5, 22, 11);
  ctx.fillStyle = sukunaTransformed ? '#ff8844' : '#0088ff';
  ctx.globalAlpha = 0.5 + Math.sin(t / 80) * 0.3;
  ctx.fillRect(player.x + 8, player.y + 16, 4, 5);
  ctx.fillRect(player.x + 16, player.y + 16, 4, 5);
  ctx.globalAlpha = 1;
  if (shieldActive) {
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(player.x - 4, player.y - 4, 34, 32);
  }

  // Disparo do Jogador
  if (keys['Space'] && t - player.lastShot > playerStats.fireRate) {
    const ms = playerStats.multiShot;
    for (let i = 0; i < ms; i++) {
      const spread = ms > 1 ? (i - (ms - 1) / 2) * 1.6 : 0;
      bullets.push({
        x: player.x + 11,
        y: player.y,
        vx: spread,
        vy: BULLET_SPEED,
        bounceCount: playerStats.bounce
      });
    }
    player.lastShot = t;
    playSound('shoot');
  }

  // Atualização dos Tiros do Jogador
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (b.vx) b.x += b.vx * timeScale;
    b.y += b.vy * timeScale;

    // Quique nas laterais
    if (b.bounceCount > 0 && (b.x < 0 || b.x > W - 3)) {
      b.vx *= -1;
      b.x = Math.max(0, Math.min(W - 3, b.x));
      b.bounceCount--;
    }

    ctx.fillStyle = b.isReflected ? '#00f3ff' : '#ffff00';
    ctx.fillRect(b.x, b.y, 3, 8);
    ctx.fillStyle = b.isReflected ? '#00f3ff88' : '#ffff0088';
    ctx.fillRect(b.x, b.y + 8, 3, 4);

    // Colisão com Boss
    if (bossMode && currentBoss && b.x > currentBoss.x && b.x < currentBoss.x + currentBoss.w && b.y > currentBoss.y && b.y < currentBoss.y + currentBoss.h) {
      const baseDmg = (isMiniBoss ? 11 : 7.0) * playerStats.damage;
      const dmg = b.isReflected ? (baseDmg * 2.5) : baseDmg;
      currentBoss.hp -= dmg;
      currentBoss.hitFlash = 3;
      floatingTexts.push({ x: b.x, y: b.y, life: 1, text: Math.round(dmg), color: b.isReflected ? '#00f3ff' : '#ffff00' });
      checkRally();

      if (Math.random() < playerStats.lifesteal) {
        lives = Math.min(maxLives, +(lives + 1).toFixed(2));
        updateLifeBar();
      }
      if (!playerStats.pierce) bullets.splice(i, 1);
      score += 4;
      document.getElementById('score-display').textContent = score;
      updateBossHp();
      playSound('hit');
      shake = 4;
      for (let k = 0; k < 7; k++) {
        particles.push({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 1, color: '#ffff00' });
      }
      if (currentBoss.hp <= 0) endGame(true, isMiniBoss ? 'Mini-boss derrotado!' : `${currentBoss.name} derrotado!`);
      continue;
    }

    // Colisão com Inimigos de Fase / Waves
    if (!bossMode) {
      let hit = false;
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.dead) continue;

        if (b.x < e.x + e.w && b.x + 3 > e.x && b.y < e.y + e.h && b.y + 8 > e.y) {
          if (!playerStats.pierce) bullets.splice(i, 1);
          hit = true;
          const hitDmg = b.isReflected ? (playerStats.damage * 3) : playerStats.damage;
          e.hp -= hitDmg;
          e.hitFlash = 4;
          checkRally();

          if (Math.random() < playerStats.lifesteal) {
            lives = Math.min(maxLives, +(lives + 1).toFixed(2));
            updateLifeBar();
          }

          if (inQuestionWave) {
            if (e.isCorrect) {
              e.dead = true;
              onCorrect();
            } else if (e.hp <= 0) {
              e.dead = true;
              if (e.text) {
                loseLife('Resposta Incorreta');
              } else {
                score += 5;
                document.getElementById('score-display').textContent = score;
              }
            }
          } else {
            // Wave de combate pura
            if (e.hp <= 0) {
              e.dead = true;
              score += 10;
              coins += 1;
              document.getElementById('score-display').textContent = score;
              updateUI();
              for (let k = 0; k < 6; k++) {
                particles.push({
                  x: e.x + e.w / 2,
                  y: e.y + e.h / 2,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 0.8,
                  color: '#ffcc00'
                });
              }
            }
          }
          break;
        }
      }
      if (hit) continue;
    }

    if (b.y < -20 || b.x < -20 || b.x > W + 20) bullets.splice(i, 1);
  }

  // Atualiza e desenha esquadrões de inimigos normais
  if (!bossMode) {
    updateAllEnemies(t, dt);
    drawAllEnemies(t);

    // Detecção de Conclusão da Wave de Combate
    if (!inQuestionWave && enemies.length > 0 && enemies.every(e => e.dead)) {
      enemies = [];
      currentWave++;
      setTimeout(() => {
        if (gameState === 'PLAYING' && !bossMode) {
          if (currentWave <= 5) {
            spawnNextWave();
          } else {
            generateDraft();
          }
        }
      }, 500);
    }
  }

  // Atualização dos Projéteis dos Inimigos
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    eb.x += (eb.vx || 0) * timeScale;
    eb.y += (eb.vy || 2.2) * timeScale;

    ctx.fillStyle = eb.color || '#ff3366';
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.r || 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Colisão de Projétil com o Player
    if (Math.hypot(player.x + 12 - eb.x, player.y + 10 - eb.y) < 16 && player.invuln <= 0) {
      if (parryWindow > 0) {
        // PARRY PERFEITO DE PROJÉTIL!
        document.getElementById('parry-shine').style.opacity = '0.65';
        setTimeout(() => document.getElementById('parry-shine').style.opacity = '0', 90);
        score += 25;
        coins += 2;
        superMeter = Math.min(100, superMeter + 10);
        if (superMeter >= 100) superReady = true;
        document.getElementById('super-bar').style.width = superMeter + '%';
        playSound('parry');
        shake = 5;
        checkRally();
        floatingTexts.push({ x: player.x, y: player.y - 14, life: 1.2, text: '✨ PARRY!', color: '#00f3ff' });

        // Reflete o projétil como super bala do jogador
        bullets.push({
          x: eb.x,
          y: eb.y - 6,
          vx: -(eb.vx || 0) * 1.5,
          vy: -9,
          bounceCount: 1,
          isReflected: true
        });

        enemyBullets.splice(i, 1);
        document.getElementById('score-display').textContent = score;
      } else if (!shieldActive) {
        lives--;
        lastDamageTime = performance.now();
        recoverableHealth = 0.5;
        player.invuln = 28;
        updateLifeBar();
        playSound('wrong');
        shake = 7;
        if (lives <= 0) endGame(false, 'Derrotado por projétil');
      }
    }

    if (eb.y > H + 20 || eb.x < -30 || eb.x > W + 30) enemyBullets.splice(i, 1);
  }

  // Lógica dos Bosses (Preservada!)
  if (bossMode && currentBoss) {
    currentBoss.x += currentBoss.vx;
    if (currentBoss.x < 15 || currentBoss.x > W - currentBoss.w - 15) currentBoss.vx *= -1;
    currentBoss.timer--;
    if (currentBoss.timer <= 0) {
      bossAttack();
      currentBoss.timer = 40 + Math.random() * 25;
    }
    drawBoss(currentBoss);

    for (let i = minions.length - 1; i >= 0; i--) {
      const m = minions[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life--;
      ctx.fillStyle = '#cc88ff';
      ctx.fillRect(m.x, m.y, 12, 12);
      if (Math.hypot(player.x + 12 - m.x, player.y + 10 - m.y) < 16 && player.invuln <= 0) {
        if (parryWindow > 0) {
          // PARRY EM MINION!
          document.getElementById('parry-shine').style.opacity = '0.65';
          setTimeout(() => document.getElementById('parry-shine').style.opacity = '0', 90);
          score += 30;
          coins += 3;
          playSound('parry');
          shake = 5;
          checkRally();
          floatingTexts.push({ x: player.x, y: player.y - 14, life: 1.2, text: '✨ PARRY!', color: '#00f3ff' });
          minions.splice(i, 1);
          continue;
        } else if (!shieldActive) {
          lives--;
          lastDamageTime = performance.now();
          recoverableHealth = 0.5;
          player.invuln = 28;
          updateLifeBar();
          playSound('wrong');
          shake = 7;
          if (lives <= 0) endGame(false, 'Derrotado');
          minions.splice(i, 1);
          continue;
        }
      }
      if (m.life <= 0 || m.y > H) minions.splice(i, 1);
    }

    for (let i = bossBullets.length - 1; i >= 0; i--) {
      const b = bossBullets[i];
      if (b.life !== undefined) {
        b.life--;
        if (b.life <= 0) { bossBullets.splice(i, 1); continue; }
      }
      b.x += b.vx || 0;
      b.y += b.vy || 0;
      ctx.fillStyle = b.color || '#ff4444';
      if (b.w) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r || 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.hypot(player.x + 12 - b.x, player.y + 10 - b.y) < 16 && player.invuln <= 0) {
        if (parryWindow > 0) {
          // PARRY EM BALA DE BOSS!
          document.getElementById('parry-shine').style.opacity = '0.65';
          setTimeout(() => document.getElementById('parry-shine').style.opacity = '0', 90);
          score += 30;
          coins += 4;
          superMeter = Math.min(100, superMeter + 15);
          if (superMeter >= 100) superReady = true;
          document.getElementById('super-bar').style.width = superMeter + '%';
          playSound('parry');
          save();
          shake = 5;
          checkRally();
          floatingTexts.push({ x: player.x, y: player.y - 14, life: 1.2, text: '✨ PARRY!', color: '#00f3ff' });

          // Reflete projétil do boss
          bullets.push({
            x: b.x,
            y: b.y - 6,
            vx: -(b.vx || 0) * 1.5,
            vy: -9,
            bounceCount: 1,
            isReflected: true
          });

          bossBullets.splice(i, 1);
          document.getElementById('score-display').textContent = score;
        } else if (!shieldActive) {
          lives--;
          lastDamageTime = performance.now();
          recoverableHealth = 0.5;
          player.invuln = 32;
          updateLifeBar();
          playSound('wrong');
          shake = 8;
          if (lives <= 0) endGame(false, 'Derrotado');
        }
      }
      if (b.x < -50 || b.x > W + 50 || b.y > H + 50) bossBullets.splice(i, 1);
    }
  }

  // Habilidades de Corte (Sukuna)
  for (let i = slashes.length - 1; i >= 0; i--) {
    const s = slashes[i];
    s.life--;
    s.x += s.vx;
    s.y += s.vy;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(Math.atan2(s.vy, s.vx));
    ctx.strokeStyle = s.type === 's' ? '#ff0000' : '#dddddd';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-s.len / 2, 0); ctx.lineTo(s.len / 2, 0); ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-s.len / 2, 0); ctx.lineTo(s.len / 2, 0); ctx.stroke();
    ctx.restore();
    if (!bossMode) {
      enemies.forEach(e => {
        if (e.dead || e.isCorrect) return;
        if (Math.hypot(s.x - (e.x + e.w / 2), s.y - (e.y + e.h / 2)) < 24) {
          e.dead = true;
          s.life = 0;
          score += 7;
          checkRally();
          document.getElementById('score-display').textContent = score;
        }
      });
    }
    if (s.life <= 0) slashes.splice(i, 1);
  }

  // Habilidades de Laser (Raio Opala)
  for (let i = lasers.length - 1; i >= 0; i--) {
    const L = lasers[i];
    L.h += 15;
    if (L.h > L.maxH) L.h = L.maxH;
    L.life--;
    ctx.strokeStyle = `hsl(${(L.color + t / 7) % 360},100%,55%)`;
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(L.x, L.y - L.h); ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(L.x, L.y - L.h); ctx.stroke();
    if (!bossMode) {
      enemies.forEach(e => {
        if (e.dead || e.isCorrect) return;
        if (Math.abs(e.x + e.w / 2 - L.x) < 22 && e.y < L.y && e.y > L.y - L.h) {
          e.dead = true;
          score += 7;
          checkRally();
        }
      });
    }
    if (bossMode && currentBoss && Math.abs(currentBoss.x + currentBoss.w / 2 - L.x) < 26) {
      currentBoss.hp -= 2.2;
      currentBoss.hitFlash = 2;
      updateBossHp();
      checkRally();
      if (currentBoss.hp <= 0) endGame(true, `${currentBoss.name} derrotado`);
    }
    if (L.life <= 0) lasers.splice(i, 1);
  }

  // Habilidades de Cereja
  for (let i = cherries.length - 1; i >= 0; i--) {
    const ch = cherries[i];
    ch.life--;
    if (ch.giant) {
      ch.y += ch.vy;
      ctx.fillStyle = '#ee2222';
      ctx.beginPath(); ctx.arc(ch.x, ch.y, 13, 0, Math.PI * 2); ctx.fill();
      if (ch.life < 35 && !ch.exploded) {
        ch.exploded = true;
        for (let j = 0; j < 11; j++) {
          const a = Math.PI * 2 / 11 * j;
          cherries.push({ x: ch.x, y: ch.y, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, life: 60 });
        }
      }
    } else {
      ch.x += ch.vx;
      ch.y += ch.vy;
      ctx.fillStyle = '#ff5555';
      ctx.beginPath(); ctx.arc(ch.x, ch.y, 4, 0, Math.PI * 2); ctx.fill();
      if (!bossMode) {
        enemies.forEach(e => {
          if (e.dead || e.isCorrect) return;
          if (Math.hypot(ch.x - (e.x + e.w / 2), ch.y - (e.y + e.h / 2)) < 18) {
            e.dead = true;
            score += 5;
            checkRally();
          }
        });
      }
      if (bossMode && currentBoss && Math.hypot(ch.x - (currentBoss.x + currentBoss.w / 2), ch.y - (currentBoss.y + currentBoss.h / 2)) < 24) {
        currentBoss.hp -= 1.8;
        currentBoss.hitFlash = 2;
        updateBossHp();
        checkRally();
        if (currentBoss.hp <= 0) endGame(true, `${currentBoss.name} derrotado`);
        ch.life = 0;
      }
    }
    if (ch.life <= 0) cherries.splice(i, 1);
  }

  // Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.05;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
    if (p.life <= 0) particles.splice(i, 1);
  }

  // Textos Flutuantes (Floating Texts)
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y -= 1.2;
    ft.life -= 0.025;
    ctx.globalAlpha = Math.max(0, ft.life);
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }

  // HUD de Carta Pendente ou Desafio de Reroll (Em jogo)
  if (!bossMode) {
    if (rerollMode) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#1a1000ee';
      ctx.fillRect(8, H - 28, 205, 20);
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, H - 28, 205, 20);
      ctx.fillStyle = '#ffaa00';
      ctx.font = 'bold 9px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(`🔄 DESAFIO REROLL (${3 - rerollQuestionsLeft}/2)`, 14, H - 15);
    } else if (pendingBoon) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#0a1424ee';
      ctx.fillRect(8, H - 28, 185, 20);
      ctx.strokeStyle = pendingBoon.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(8, H - 28, 185, 20);
      ctx.fillStyle = pendingBoon.color;
      ctx.font = 'bold 9px Courier New';
      ctx.textAlign = 'left';
      ctx.fillText(`⚡ APOSTA: ${pendingBoon.name}`, 14, H - 15);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();

  // Timers de Especiais, Escudo e Parry
  if (superActive) {
    superTimer -= dt;
    if (superTimer <= 0) {
      superActive = false;
      sukunaActive = false;
      zaActive = false;
      sukunaTransformed = false;
      timeScale = 1;
      shieldActive = false;
    }
  }
  if (shieldActive && !superActive) {
    shieldTimer -= dt;
    if (shieldTimer <= 0) shieldActive = false;
  }

  if (parryWindow > 0) parryWindow--;
  if (player.invuln > 0) player.invuln--;

  requestAnimationFrame(loop);
}

// Event Listeners
window.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (document.getElementById('screen-initials') && !document.getElementById('screen-initials').classList.contains('hidden')) {
    if (e.key === 'ArrowUp' || e.code === 'KeyW') { shiftChar(1); e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.code === 'KeyS') { shiftChar(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.code === 'KeyD') { nextCharSlot(); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.code === 'KeyA') { prevCharSlot(); e.preventDefault(); }
    if (e.key === 'Enter') { submitInitials(); e.preventDefault(); }
    if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
      currentInitials[activeCharIndex] = e.key.toUpperCase();
      nextCharSlot();
      e.preventDefault();
    }
    return;
  }

  if (e.code === 'Space' && (gameState === 'PLAYING' || gameState === 'BOSS')) e.preventDefault();
  if (e.code === 'ShiftLeft' && (gameState === 'PLAYING' || gameState === 'BOSS')) activateSuper();
  if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'KeyK') doParry();
  if (e.code === 'KeyZ') subAbility('z');
  if (e.code === 'KeyX') subAbility('x');
  if (e.code === 'KeyC') {
    if (sukunaActive) subAbility('c');
    else doParry();
  }
  if (e.code === 'KeyP') {
    gameState = 'MENU';
    showScreen('screen-title');
  }
});
window.addEventListener('keyup', e => keys[e.code] = false);

window.addEventListener('contextmenu', e => {
  if (gameState === 'PLAYING' || gameState === 'BOSS') {
    e.preventDefault();
    doParry();
  }
});

document.body.addEventListener('click', initAudio, { once: true });
updateUI();
showScreen('screen-title');