const dhikrs = {
  subhanallah: {
    name: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", meaning: "Glory be to Allah",
    virtue: "“The words most beloved to Allah are four: SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar.”",
    source: "Sahih Muslim 2137", reflection: "SubhanAllah declares Allah free from every imperfection. Pause over the meaning rather than rushing through the words."
  },
  alhamdulillah: {
    name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", meaning: "All praise belongs to Allah",
    virtue: "“Purity is half of faith, and Alhamdulillah fills the scale.”",
    source: "Sahih Muslim 223", reflection: "Let this phrase bring to mind the blessings you notice and the blessings you may overlook."
  },
  allahuakbar: {
    name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", meaning: "Allah is the Greatest",
    virtue: "“The words most beloved to Allah are four: SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar.”",
    source: "Sahih Muslim 2137", reflection: "Remember that Allah is greater than everything that occupies your thoughts and worries."
  },
  astaghfirullah: {
    name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", meaning: "I seek forgiveness from Allah",
    virtue: "“Ask your Lord for forgiveness. Indeed, He is ever a Perpetual Forgiver.”",
    source: "Quran 71:10", reflection: "Istighfar is a way of turning back to Allah with hope, humility and trust in His mercy."
  },
  tahlil: {
    name: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", meaning: "There is no deity worthy of worship except Allah",
    virtue: "“The words most beloved to Allah are four: SubhanAllah, Alhamdulillah, La ilaha illallah, and Allahu Akbar.”",
    source: "Sahih Muslim 2137", reflection: "This is the testimony of tawheed. Recite it while reflecting on its meaning and what it asks of the heart."
  }
};

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "dhikr-pwa-v2";
const todayKey = new Date().toLocaleDateString("en-CA");
let state = loadState();
let toastTimer;

function loadState() {
  try {
    const hasV2 = localStorage.getItem(STORAGE_KEY) !== null;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("dhikr-pwa-v1") || "{}");
    return { counts: saved.counts || {}, targets: saved.targets || {}, daily: saved.daily || {}, theme: hasV2 ? (saved.theme || "light") : "light" };
  } catch { return { counts: {}, targets: {}, daily: {}, theme: "light" }; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function currentId() { return $("dhikrSelect").value; }
function countFor(id=currentId()) { return state.counts[id] || 0; }
function targetFor(id=currentId()) { return state.targets[id] || 33; }
function makeSapling(index) {
  const sapling = document.createElement("span");
  sapling.className = "mini-sapling";
  sapling.setAttribute("aria-hidden", "true");
  sapling.innerHTML = `<svg viewBox="0 0 32 38" focusable="false"><path d="M16 34 Q17 25 16 16" class="sapling-trunk"/><path d="M16 17 Q7 8 2 12 Q9 13 15 20 M16 16 Q13 5 8 3 Q13 10 16 19 M16 16 Q20 5 26 4 Q21 11 17 19 M17 18 Q26 12 30 16 Q23 16 17 21" class="sapling-leaf"/></svg>`;
  sapling.style.setProperty("--sapling-delay", `${Math.min(index * 18, 180)}ms`);
  return sapling;
}
function updateScene() {
  const scene = $("gardenScene");
  const plants = $("scenePlants");
  if (!scene || !plants) return;
  const count = countFor();
  const stage = count >= 100 ? "dawn" : count >= 50 ? "fountain" : count >= 20 ? "garden" : count > 0 ? "rain" : "rest";
  scene.dataset.stage = stage;
  const stageLabel = scene.querySelector("[data-stage-label]");
  if (stageLabel) stageLabel.textContent = stage === "rest" ? "BEGIN" : stage.toUpperCase();

  // The illustration shows up to 30 individual plants; later recitations deepen
  // the garden's growth and unlock scenery rather than implying a literal reward count.
  const visiblePlants = Math.min(count, 30);
  if (Number(plants.dataset.count || -1) === visiblePlants) return;
  plants.dataset.count = String(visiblePlants);
  const spots = [];
  for (let i = 0; i < 15; i++) {
    spots.push({ x: 35 + i * 10.2, y: 216 + (i % 2) * 10, scale: .62 + (i % 3) * .08 });
    spots.push({ x: 385 + i * 10.2, y: 216 + ((i + 1) % 2) * 10, scale: .62 + ((i + 1) % 3) * .08 });
  }
  const chosen = spots.slice(0, visiblePlants);
  plants.innerHTML = chosen.map((spot, i) => `
    <g class="scene-sapling" transform="translate(${spot.x.toFixed(1)} ${spot.y}) scale(${spot.scale.toFixed(2)})" style="--plant-delay:${Math.min(i * 22, 500)}ms">
      <path class="plant-stem" d="M0 0 Q1 -8 0 -15"/>
      <path class="plant-leaf" d="M0 -13 Q-8 -23 -14 -18 Q-7 -17 -1 -10 M0 -14 Q-2 -25 4 -29 Q4 -20 1 -10 M1 -13 Q9 -23 15 -18 Q8 -17 2 -10"/>
    </g>`).join("");
}

function updateUI() {
  const item = dhikrs[currentId()];
  const count = countFor();
  const target = targetFor();
  $("arabicText").textContent = item.arabic;
  $("dhikrTitle").textContent = item.name;
  $("meaningText").textContent = item.meaning;
  $("virtueText").textContent = item.virtue;
  $("sourceText").textContent = item.source;
  $("reflectionText").textContent = item.reflection;
  $("countNumber").textContent = count;
  $("targetLabel").textContent = target;
  const progress = Math.min(100, Math.round((count / target) * 100));
  $("progressFill").style.width = progress + "%";
  $("progressTrack").setAttribute("aria-valuemax", target);
  $("progressTrack").setAttribute("aria-valuenow", Math.min(count, target));
  $("completionMessage").textContent = count >= target ? "Target reached. Alhamdulillah." : "";
  const today = state.daily[todayKey] || {};
  $("todayCount").textContent = Object.values(today).reduce((a,b) => a+b, 0);
  $("typesCount").textContent = Object.values(today).filter(v => v > 0).length;
  $("themeButton").textContent = state.theme === "dark" ? "☀" : "☾";
  document.body.classList.toggle("dark", state.theme === "dark");
  document.body.classList.toggle("light", state.theme !== "dark");
  updateScene();
}
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 1700);
}
$("tapButton").addEventListener("click", () => {
  const id = currentId();
  state.counts[id] = countFor(id) + 1;
  state.daily[todayKey] ||= {};
  state.daily[todayKey][id] = (state.daily[todayKey][id] || 0) + 1;
  saveState(); updateUI();
  if (countFor(id) === targetFor(id)) showToast("Target reached — Alhamdulillah");
});
$("undoButton").addEventListener("click", () => {
  const id = currentId();
  if (!countFor(id)) return;
  state.counts[id]--;
  if (state.daily[todayKey]?.[id] > 0) state.daily[todayKey][id]--;
  saveState(); updateUI();
});
$("resetButton").addEventListener("click", () => {
  const id = currentId();
  if (!countFor(id)) return;
  if (!confirm("Reset the current dhikr count?")) return;
  state.counts[id] = 0;
  saveState(); updateUI(); showToast("Counter reset");
});
$("dhikrSelect").addEventListener("change", updateUI);
$("editTarget").addEventListener("click", () => {
  const value = prompt("Set a target (for example, 33 or 100):", targetFor());
  if (value === null) return;
  const target = Number.parseInt(value, 10);
  if (!Number.isInteger(target) || target < 1 || target > 100000) return showToast("Enter a number from 1 to 100,000");
  state.targets[currentId()] = target; saveState(); updateUI();
});
$("themeButton").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState(); updateUI();
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}
let deferredInstall;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); deferredInstall = event; $("installButton").hidden = false;
});
$("installButton").addEventListener("click", async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt(); await deferredInstall.userChoice;
  deferredInstall = null; $("installButton").hidden = true;
});
updateUI();
