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
const STORAGE_KEY = "dhikr-pwa-v1";
const todayKey = new Date().toLocaleDateString("en-CA");
let state = loadState();
let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { counts: saved.counts || {}, targets: saved.targets || {}, daily: saved.daily || {}, theme: saved.theme || "dark" };
  } catch { return { counts: {}, targets: {}, daily: {}, theme: "dark" }; }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function currentId() { return $("dhikrSelect").value; }
function countFor(id=currentId()) { return state.counts[id] || 0; }
function targetFor(id=currentId()) { return state.targets[id] || 33; }
function updateGarden() {
  const grid = $("gardenGrid");
  if (!grid) return;
  if (!grid.dataset.built) {
    grid.innerHTML = Object.entries(dhikrs).map(([id, item]) => `
      <article class="tree-card" data-tree-id="${id}">
        <div class="tree-art" aria-hidden="true">
          <svg viewBox="0 0 140 132" focusable="false">
            <path class="tree-trunk" d="M69 119 C73 99 72 80 70 60 C69 52 69 46 70 39" />
            <g class="tree-canopy" style="--growth:.58">
              <path class="palm-frond" d="M70 44 C51 24 28 20 13 26 C32 28 48 35 67 49" />
              <path class="palm-frond" d="M70 43 C51 14 34 8 22 10 C41 20 54 32 69 49" />
              <path class="palm-frond" d="M70 42 C68 17 77 7 88 3 C83 21 79 34 72 50" />
              <path class="palm-frond" d="M72 44 C91 17 110 13 124 18 C103 25 88 35 74 50" />
              <path class="palm-frond" d="M73 46 C98 31 119 34 132 44 C109 42 92 45 75 52" />
              <path class="palm-frond" d="M68 46 C48 38 28 43 17 55 C39 48 53 49 68 53" />
              <circle class="palm-fruit" cx="70" cy="51" r="4" />
              <circle class="palm-fruit" cx="77" cy="54" r="3.5" />
            </g>
            <path class="ground-line" d="M28 120 Q70 113 112 120" />
          </svg>
        </div>
        <div class="tree-name">${item.name}</div>
        <div class="tree-count"><strong data-tree-count>0</strong> <span>recitations</span></div>
        <button class="tree-select" type="button" data-select-tree="${id}">Choose this dhikr</button>
      </article>`).join("");
    grid.dataset.built = "true";
    grid.querySelectorAll("[data-select-tree]").forEach(button => {
      button.addEventListener("click", () => {
        $("dhikrSelect").value = button.dataset.selectTree;
        updateUI();
        $("counter-card").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }
  grid.querySelectorAll("[data-tree-id]").forEach(card => {
    const id = card.dataset.treeId;
    const count = state.counts[id] || 0;
    const growth = Math.min(1, count / 100);
    const scale = (0.58 + growth * 0.42).toFixed(3);
    card.querySelector(".tree-canopy").style.setProperty("--growth", scale);
    card.querySelector("[data-tree-count]").textContent = count.toLocaleString();
    const selected = id === currentId();
    card.classList.toggle("selected", selected);
    const button = card.querySelector("[data-select-tree]");
    button.textContent = selected ? "Currently selected" : "Choose this dhikr";
    button.setAttribute("aria-label", `${selected ? "Currently selected" : "Select"} ${dhikrs[id].name}`);
  });
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
  $("themeButton").textContent = state.theme === "dark" ? "☾" : "☀";
  document.body.classList.toggle("light", state.theme === "light");
  updateGarden();
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
