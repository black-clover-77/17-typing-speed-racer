const audio = document.getElementById("bg-audio"),
  audioToggle = document.getElementById("audio-toggle");
let audioPlaying = false;
document.addEventListener(
  "click",
  function s() {
    audio
      .play()
      .then(() => {
        audioPlaying = true;
        audioToggle.textContent = "🔊";
      })
      .catch(() => {});
  },
  { once: true },
);
audioToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  audioPlaying
    ? (audio.pause(), (audioToggle.textContent = "🔇"), (audioPlaying = false))
    : (audio.play(), (audioToggle.textContent = "🔊"), (audioPlaying = true));
});
window.addEventListener("load", () =>
  setTimeout(
    () => document.getElementById("loader").classList.add("hidden"),
    1500,
  ),
);
const raceCanvas = document.getElementById("race-canvas"),
  rCtx = raceCanvas.getContext("2d");
raceCanvas.width = 800;
raceCanvas.height = 120;
const sentences = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold in this world.",
    "Life is what happens when you are busy making other plans.",
  ],
  medium: [
    "The scientific method is a systematic approach to understanding natural phenomena.",
    "Innovation distinguishes between a leader and a follower in technology.",
    "The greatest glory in living lies not in never falling but in rising every time.",
    "Artificial intelligence will fundamentally transform every sector of the economy.",
    "Programming is not about typing, it is about thinking clearly and solving problems.",
  ],
  hard: [
    "Quantum entanglement demonstrates non-local correlations between spatially separated particles.",
    "The implementation of blockchain-based distributed ledger technology revolutionizes transparency.",
    "Neuroplasticity enables the brain to reorganize synaptic connections throughout an organism's lifetime.",
    "Cryptocurrency decentralization challenges traditional monetary policy frameworks significantly.",
    "Machine learning algorithms optimize hyperparameters through gradient descent backpropagation.",
  ],
};
let targetText = "",
  startTime = null,
  totalKeys = 0,
  correctKeys = 0;
function newRace() {
  const diff = document.getElementById("difficulty").value;
  const sents = sentences[diff];
  targetText = sents[Math.floor(Math.random() * sents.length)];
  document.getElementById("text-input").value = "";
  startTime = null;
  totalKeys = 0;
  correctKeys = 0;
  updateDisplay();
  document.getElementById("wpm-val").textContent = "0";
  document.getElementById("accuracy-val").textContent = "100%";
  document.getElementById("time-val").textContent = "0:00";
}
function updateDisplay() {
  const input = document.getElementById("text-input").value;
  let html = "";
  for (let i = 0; i < targetText.length; i++) {
    if (i < input.length) {
      html +=
        input[i] === targetText[i]
          ? `<span class="correct">${targetText[i]}</span>`
          : `<span class="wrong">${targetText[i]}</span>`;
    } else {
      html += `<span class="pending">${targetText[i]}</span>`;
    }
  }
  document.getElementById("text-display").innerHTML = html;
}
const input = document.getElementById("text-input");
input.addEventListener("input", (e) => {
  if (!startTime) startTime = Date.now();
  const val = e.target.value;
  totalKeys = val.length;
  correctKeys = 0;
  for (let i = 0; i < val.length && i < targetText.length; i++) {
    if (val[i] === targetText[i]) correctKeys++;
  }
  const elapsed = (Date.now() - startTime) / 1000 / 60;
  const wpm = elapsed > 0 ? Math.round(correctKeys / 5 / elapsed) : 0;
  const accuracy =
    totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 100;
  document.getElementById("wpm-val").textContent = wpm;
  document.getElementById("accuracy-val").textContent = accuracy + "%";
  const secs = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("time-val").textContent =
    Math.floor(secs / 60) + ":" + (secs % 60).toString().padStart(2, "0");
  updateDisplay();
  if (val === targetText) {
    document.getElementById("text-display").innerHTML =
      `<span style="color:#FFD93D;font-size:1.5rem">🏆 RACE COMPLETE! ${wpm} WPM — ${accuracy}% Accuracy</span>`;
  }
});
function animateRace() {
  requestAnimationFrame(animateRace);
  rCtx.fillStyle = "#0D0D1A";
  rCtx.fillRect(0, 0, 800, 120);
  rCtx.strokeStyle = "rgba(233,69,96,0.2)";
  rCtx.setLineDash([5, 5]);
  for (let y = 30; y < 120; y += 30) {
    rCtx.beginPath();
    rCtx.moveTo(0, y);
    rCtx.lineTo(800, y);
    rCtx.stroke();
  }
  rCtx.setLineDash([]);
  const progress =
    totalKeys > 0 ? Math.min(1, correctKeys / targetText.length) : 0;
  const carX = 20 + progress * 720;
  rCtx.fillStyle = "#E94560";
  rCtx.fillRect(carX - 15, 15, 30, 15);
  rCtx.fillRect(carX - 20, 25, 40, 10);
  rCtx.fillStyle = "#FFD93D";
  rCtx.fillRect(carX + 15, 25, 5, 3);
  rCtx.fillRect(carX + 15, 32, 5, 3);
  const aiProgress = startTime ? (Date.now() - startTime) / 30000 : 0;
  const aiX = 20 + Math.min(1, aiProgress) * 720;
  rCtx.fillStyle = "#4FC3F7";
  rCtx.fillRect(aiX - 15, 55, 30, 15);
  rCtx.fillRect(aiX - 20, 65, 40, 10);
  rCtx.fillStyle = "rgba(255,255,255,0.3)";
  rCtx.font = "10px Rajdhani";
  rCtx.fillText("YOU", carX - 8, 12);
  rCtx.fillText("AI", aiX - 5, 52);
  rCtx.fillStyle = "rgba(255,255,255,0.15)";
  rCtx.fillRect(780, 5, 3, 110);
  rCtx.fillText("FINISH", 755, 118);
}
animateRace();
document.getElementById("restart-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  newRace();
});
document
  .getElementById("difficulty")
  .addEventListener("change", () => newRace());
newRace();
