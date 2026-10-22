let audioCtx = null;
function initAudio() { 
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
}

function playSound(t) {
  if (!audioCtx) return;
  const n = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  
  if (t === 'shoot') { o.type = 'square'; o.frequency.setValueAtTime(380, n); o.frequency.exponentialRampToValueAtTime(120, n + .05); g.gain.setValueAtTime(.05, n); g.gain.exponentialRampToValueAtTime(.001, n + .07); o.start(n); o.stop(n + .07); }
  else if (t === 'hit') { o.type = 'sawtooth'; o.frequency.setValueAtTime(180, n); o.frequency.exponentialRampToValueAtTime(45, n + .1); g.gain.setValueAtTime(.09, n); g.gain.exponentialRampToValueAtTime(.001, n + .12); o.start(n); o.stop(n + .12); }
  else if (t === 'wrong') { o.type = 'sawtooth'; o.frequency.setValueAtTime(70, n); o.frequency.linearRampToValueAtTime(32, n + .18); g.gain.setValueAtTime(.11, n); g.gain.exponentialRampToValueAtTime(.001, n + .22); o.start(n); o.stop(n + .22); }
  else if (t === 'super') { o.type = 'sine'; o.frequency.setValueAtTime(190, n); o.frequency.exponentialRampToValueAtTime(620, n + .3); g.gain.setValueAtTime(.07, n); g.gain.exponentialRampToValueAtTime(.001, n + .38); o.start(n); o.stop(n + .38); }
  else if (t === 'slash') { o.type = 'triangle'; o.frequency.setValueAtTime(950, n); o.frequency.exponentialRampToValueAtTime(180, n + .08); g.gain.setValueAtTime(.06, n); g.gain.exponentialRampToValueAtTime(.001, n + .1); o.start(n); o.stop(n + .1); }
  else if (t === 'clear') { o.type = 'sine'; o.frequency.setValueAtTime(400, n); o.frequency.exponentialRampToValueAtTime(800, n + .22); g.gain.setValueAtTime(.055, n); g.gain.exponentialRampToValueAtTime(.001, n + .28); o.start(n); o.stop(n + .28); }
  else if (t === 'parry') {
    o.type = 'sine';
    o.frequency.setValueAtTime(880, n);
    o.frequency.exponentialRampToValueAtTime(1760, n + .12);
    g.gain.setValueAtTime(.14, n);
    g.gain.exponentialRampToValueAtTime(.001, n + .18);
    o.start(n);
    o.stop(n + .18);
  }
}
