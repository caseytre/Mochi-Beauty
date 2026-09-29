/* Mochi rig: idle blink loop, swappable emotion props, and an
   Animal-Crossing-style "Animalese" speech bubble (typed-on text +
   synthesized pitch-blip per character, no audio files needed). */

const mochi = document.getElementById('mochi');
const bubble = document.getElementById('bubble');

/* ---------------- Blink loop ---------------- */
function scheduleBlink() {
  const delay = 2200 + Math.random() * 2600; // irregular, feels alive
  setTimeout(() => {
    mochi.classList.add('blinking');
    setTimeout(() => {
      mochi.classList.remove('blinking');
      scheduleBlink();
    }, 110);
  }, delay);
}
scheduleBlink();

/* ---------------- Emotion props ---------------- */
function showProp(name) {
  document.querySelectorAll('.prop').forEach(el => {
    el.classList.toggle('show', el.dataset.prop === name);
  });
}
function clearProps() {
  document.querySelectorAll('.prop').forEach(el => el.classList.remove('show'));
}

/* ---------------- Animalese speech bubble ---------------- */
let audioCtx = null;
function beep(freq, duration) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

let typeToken = 0;
function say(text, { charDelay = 35, baseFreq = 340 } = {}) {
  const myToken = ++typeToken;
  bubble.textContent = '';
  bubble.classList.add('show');
  let i = 0;

  function step() {
    if (myToken !== typeToken) return; // superseded by a newer say()
    if (i >= text.length) {
      setTimeout(() => {
        if (myToken === typeToken) bubble.classList.remove('show');
      }, 1400);
      return;
    }
    const ch = text[i];
    bubble.textContent = text.slice(0, i + 1);
    if (/[a-zA-Z0-9]/.test(ch)) {
      // small pitch wobble per character = the "Animalese" chatter effect
      const wobble = (ch.charCodeAt(0) % 7) * 18;
      beep(baseFreq + wobble, 0.045);
    }
    i++;
    setTimeout(step, /\s/.test(ch) ? charDelay * 1.6 : charDelay);
  }
  step();
}

/* ---------------- Demo wiring (remove in production embeds) ---------------- */
document.querySelectorAll('[data-action="prop"]').forEach(btn => {
  btn.addEventListener('click', () => showProp(btn.dataset.prop));
});
document.querySelector('[data-action="clear"]').addEventListener('click', clearProps);
document.querySelector('[data-action="say"]').addEventListener('click', () => {
  const lines = ["this one's a must-have!", "okay wait, obsessed.", "skip this one fr", "5 stars, no notes"];
  say(lines[Math.floor(Math.random() * lines.length)]);
});

window.Mochi = { say, showProp, clearProps };
