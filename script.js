const mainBtn = document.getElementById("mainBtn");
const dot = document.getElementById("dot");
const phaseLabel = document.getElementById("phaseLabel");

const MOBILE_BREAKPOINT = 420;
const DESKTOP_RADIUS = 130;
const MOBILE_RADIUS = 109;

const TOTAL_CYCLE_MS = 10000; // 4s Ein + 6s Aus
const INHALE_MS = 4000;
const EXHALE_MS = 6000;

let running = false;
let startTime = null;
let animationFrameId = null;

function getRadius() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_RADIUS : DESKTOP_RADIUS;
}

function setDotAngle(angleDeg) {
  const radius = getRadius();
  dot.style.transform = `rotate(${angleDeg}deg) translateY(-${radius}px)`;
}

function updateScene(elapsedMs) {
  const cycleMs = elapsedMs % TOTAL_CYCLE_MS;

  let progress;
  let angle;
  let label;

  if (cycleMs < INHALE_MS) {
    progress = cycleMs / INHALE_MS;
    angle = progress * 180;
    label = "Ein";
  } else {
    progress = (cycleMs - INHALE_MS) / EXHALE_MS;
    angle = 180 + progress * 180;
    label = "Aus";
  }

  phaseLabel.textContent = label;
  setDotAngle(angle);
}

function animate(timestamp) {
  if (!running) return;

  if (startTime === null) {
    startTime = timestamp;
  }

  const elapsedMs = timestamp - startTime;
  updateScene(elapsedMs);

  animationFrameId = requestAnimationFrame(animate);
}

function startTimer() {
  running = true;
  startTime = null;
  mainBtn.textContent = "Reset";
  animationFrameId = requestAnimationFrame(animate);
}

function resetTimer() {
  running = false;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  startTime = null;
  phaseLabel.textContent = "";
  setDotAngle(0);
  mainBtn.textContent = "Start";
}

mainBtn.addEventListener("click", () => {
  if (!running) {
    startTimer();
  } else {
    resetTimer();
  }
});

window.addEventListener("resize", () => {
  if (!running) {
    setDotAngle(0);
  }
});

resetTimer();
