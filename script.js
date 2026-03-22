const mainBtn = document.getElementById("mainBtn");
const dot = document.getElementById("dot");
const phaseLabel = document.getElementById("phaseLabel");

const DESKTOP_RADIUS = 130;
const MOBILE_RADIUS = 109;
const MOBILE_BREAKPOINT = 420;

const phases = [
  { label: "Ein", durationMs: 4000, dotClass: "inhale" },
  { label: "Aus", durationMs: 6000, dotClass: "exhale" }
];

let running = false;
let currentPhaseIndex = 0;
let phaseStartTime = null;
let animationFrameId = null;

function getRadius() {
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_RADIUS : DESKTOP_RADIUS;
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function setDotAngle(angleDeg) {
  const radius = getRadius();
  dot.style.transform = `rotate(${angleDeg}deg) translateY(-${radius}px)`;
}

function applyPhaseVisuals() {
  const phase = phases[currentPhaseIndex];
  phaseLabel.textContent = phase.label;

  dot.classList.remove("inhale", "exhale");
  dot.classList.add(phase.dotClass);
}

function animate(timestamp) {
  if (!running) return;

  if (phaseStartTime === null) {
    phaseStartTime = timestamp;
    applyPhaseVisuals();
  }

  const currentPhase = phases[currentPhaseIndex];
  const elapsed = timestamp - phaseStartTime;
  const rawProgress = Math.min(elapsed / currentPhase.durationMs, 1);
  const easedProgress = easeInOutSine(rawProgress);
  const angle = easedProgress * 360;

  setDotAngle(angle);

  if (elapsed >= currentPhase.durationMs) {
    currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    phaseStartTime = timestamp;
    setDotAngle(0);
    applyPhaseVisuals();
  }

  animationFrameId = requestAnimationFrame(animate);
}

function startTimer() {
  running = true;
  currentPhaseIndex = 0;
  phaseStartTime = null;
  mainBtn.textContent = "Reset";
  animationFrameId = requestAnimationFrame(animate);
}

function resetTimer() {
  running = false;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  currentPhaseIndex = 0;
  phaseStartTime = null;
  phaseLabel.textContent = "";
  dot.classList.remove("inhale", "exhale");
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