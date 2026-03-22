const mainBtn = document.getElementById("mainBtn");

const phaseLabel = document.getElementById("phaseLabel");
const countdown = document.getElementById("countdown");
const breathingCircle = document.getElementById("breathingCircle");
const leftHalf = document.getElementById("leftHalf");
const rightHalf = document.getElementById("rightHalf");

const phases = [
  { name: "Einatmen", duration: 4, className: "inhale" },
  { name: "Ausatmen", duration: 6, className: "exhale" }
];

let currentPhaseIndex = 0;
let timeLeft = phases[0].duration;
let intervalId = null;
let running = false;

function updateUI() {
  const currentPhase = phases[currentPhaseIndex];

  phaseLabel.textContent = currentPhase.name;
  countdown.textContent = `${timeLeft}`;

  breathingCircle.classList.remove("inhale", "exhale");
  breathingCircle.classList.add(currentPhase.className);

  if (currentPhase.name === "Einatmen") {
    rightHalf.classList.remove("dimmed");
    leftHalf.classList.add("dimmed");
  } else {
    leftHalf.classList.remove("dimmed");
    rightHalf.classList.add("dimmed");
  }
}

function nextPhase() {
  currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
  timeLeft = phases[currentPhaseIndex].duration;
  updateUI();
}

function tick() {
  if (timeLeft > 1) {
    timeLeft--;
    updateUI();
  } else {
    nextPhase();
  }
}

function startTimer() {
  running = true;
  mainBtn.textContent = "Reset";
  updateUI();
  intervalId = setInterval(tick, 1000);
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  running = false;

  currentPhaseIndex = 0;
  timeLeft = phases[0].duration;

  phaseLabel.textContent = "Bereit";
  countdown.textContent = "--";
  breathingCircle.classList.remove("inhale", "exhale");

  leftHalf.classList.remove("dimmed");
  rightHalf.classList.remove("dimmed");

  mainBtn.textContent = "Start";
}

mainBtn.addEventListener("click", () => {
  if (!running) {
    startTimer();
  } else {
    resetTimer();
  }
});