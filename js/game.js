/* ============================================================
   RECYCLE RUSH — GAME LOGIC
   You shouldn't need to edit this file to customize the game —
   see js/config.js for items, bins, levels, lives, timer & points.
   ============================================================ */

const screens = {
  start: document.getElementById("screen-start"),
  play: document.getElementById("screen-play"),
  levelEnd: document.getElementById("screen-level-end"),
  gameOver: document.getElementById("screen-game-over"),
  debug: document.getElementById("screen-debug"),
};

const el = {
  legend: document.getElementById("legend"),
  levelSelect: document.getElementById("level-select"),
  nextLevelBtn: document.getElementById("next-level-btn"),
  levelEndSelectBtn: document.getElementById("level-end-select-btn"),
  restartBtn: document.getElementById("restart-btn"),
  score: document.getElementById("score"),
  levelLabel: document.getElementById("level-label"),
  lives: document.getElementById("lives"),
  itemCount: document.getElementById("item-count"),
  itemTimeBar: document.getElementById("item-time-bar"),
  itemStage: document.getElementById("item-stage"),
  bins: document.getElementById("bins"),
  feedback: document.getElementById("feedback"),
  levelEndTitle: document.getElementById("level-end-title"),
  levelEndScore: document.getElementById("level-end-score"),
  gameOverTitle: document.getElementById("game-over-title"),
  finalScore: document.getElementById("final-score"),
  muteBtn: document.getElementById("mute-btn"),
  bestScore: document.getElementById("best-score"),
  lifeBonus: document.getElementById("life-bonus"),
  pauseBtn: document.getElementById("pause-btn"),
  pauseOverlay: document.getElementById("pause-overlay"),
  resumeBtn: document.getElementById("resume-btn"),
  quitBtn: document.getElementById("quit-btn"),
  langBtn: document.getElementById("lang-btn"),
  debugBtn: document.getElementById("debug-btn"),
  debugBackBtn: document.getElementById("debug-back-btn"),
  debugGrid: document.getElementById("debug-grid"),
  debugCount: document.getElementById("debug-count"),
};

// Current language. Deliberately not saved — every visit starts in DEFAULT_LANGUAGE.
let lang = DEFAULT_LANGUAGE;

// Looks up a UI string from TEXT and fills in {placeholders} from vars.
function t(key, vars) {
  const text = TEXT[lang][key];
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars && name in vars ? vars[name] : match));
}

// Picks the current language from a { mk: "...", en: "..." } value.
// Plain strings are returned as-is, so untranslated names still work.
function localized(value) {
  return typeof value === "string" ? value : value[lang];
}

const BEST_SCORE_KEY = "recycleRush.bestScore";

// localStorage can throw in some private-browsing modes, so fail quietly.
function loadBestScore() {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY), 10) || 0;
  } catch (e) {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch (e) {}
}

let bestScore = loadBestScore();

function renderBestScore() {
  el.bestScore.textContent = bestScore;
}

let state = {
  levelIndex: 0,
  score: 0,
  lives: LIVES,
  itemsDone: 0, // items sorted or missed so far this level
  itemTimer: null,
  itemTimeLeft: 0,
  currentItem: null,
  itemNumber: 1, // number shown in the "Item n / total" counter
  levelScore: 0,
  locked: false,
  won: true, // result of the last finished game, for the game over title
  livesGained: 0, // bonus lives given for the last completed level
  bins: [], // bin ids active this level, see pickBins()
  deck: [], // items still to be shown this level, see drawItem()
  paused: false,
  pendingContinue: false, // an item finished while paused; move on when resumed
  session: 0, // bumped on level start / quit so stale timeouts do nothing
};

// A simple recycling-can icon, tinted with each bin's color.
function canIconSVG(color, size) {
  size = size || 40;
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
    <rect x="26" y="4" width="12" height="7" rx="2" fill="${color}" stroke="#2b2b2b" stroke-width="2"/>
    <rect x="9" y="11" width="46" height="9" rx="3" fill="${color}" stroke="#2b2b2b" stroke-width="2"/>
    <path d="M14 22 L17 57 a4 4 0 0 0 4 4 h22 a4 4 0 0 0 4 -4 L50 22 Z" fill="${color}" stroke="#2b2b2b" stroke-width="2"/>
    <path d="M24 27 L26 54 M32 27 L32 54 M40 27 L38 54" stroke="#00000035" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

// A bin's icon: its custom image if one is set in config.js,
// otherwise the built-in can icon tinted with the bin's color.
function binIconHTML(bin, size) {
  if (bin.image) {
    return `<img class="bin-img" src="${bin.image}" alt="" width="${size}" height="${size}">`;
  }
  return canIconSVG(bin.color, size);
}

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  // The start screen can be scrolled; start each screen from the top so
  // the play screen isn't shown partly scrolled off.
  window.scrollTo(0, 0);
}

// Mobile browsers (especially Chrome on iPhone) don't report the visible
// height reliably in CSS, so measure it and expose it as --app-height.
function updateAppHeight() {
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}
window.addEventListener("resize", updateAppHeight);
if (window.visualViewport) window.visualViewport.addEventListener("resize", updateAppHeight);
updateAppHeight();

function updateScore(delta) {
  // Never let the total score drop below zero.
  const applied = Math.max(delta, -state.score);
  state.score += applied;
  state.levelScore += applied;
  el.score.textContent = state.score;

  // Save a new best as soon as it's reached, so it survives quitting mid-game.
  if (state.score > bestScore) {
    bestScore = state.score;
    saveBestScore(bestScore);
    renderBestScore();
  }
}

// Returns a shuffled copy of the list (Fisher–Yates).
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Items are dealt from a shuffled deck so none repeats within a level.
// The deck is only refilled if a level asks for more items than its bins
// have (possible after editing config.js), in which case repeats are unavoidable.
function drawItem() {
  if (state.deck.length === 0) {
    state.deck = shuffle(ITEMS.filter((i) => state.bins.includes(i.type)));
  }
  return state.deck.pop();
}

// Picks this level's bin ids. A number means that many random bin types
// in random order; a list of ids is used as-is (fixed set and order).
function pickBins(levelConfig) {
  if (Array.isArray(levelConfig.bins)) return levelConfig.bins;
  return shuffle(BIN_TYPES.map((b) => b.id)).slice(0, levelConfig.bins);
}

function renderBins() {
  el.bins.innerHTML = "";
  state.bins.forEach((binId) => {
    const bin = BIN_TYPES.find((b) => b.id === binId);
    const btn = document.createElement("button");
    btn.className = "bin";
    btn.dataset.binId = bin.id;
    btn.style.setProperty("--bin-color", bin.color);
    btn.innerHTML = `<span class="bin-icon">${binIconHTML(bin, 44)}</span><span class="bin-label">${localized(bin.label)}</span>`;
    btn.addEventListener("click", () => handleAnswer(bin.id, btn));
    el.bins.appendChild(btn);
  });
}

function renderLegend() {
  el.legend.innerHTML = "";
  BIN_TYPES.forEach((bin) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `${binIconHTML(bin, 20)}<span>${localized(bin.label)}</span>`;
    el.legend.appendChild(item);
  });
}

// Updates the bin labels in place, so switching language mid-level
// doesn't rebuild the buttons.
function renderBinLabels() {
  el.bins.querySelectorAll(".bin").forEach((btn) => {
    const bin = BIN_TYPES.find((b) => b.id === btn.dataset.binId);
    btn.querySelector(".bin-label").textContent = localized(bin.label);
  });
}

function renderLevelSelect() {
  el.levelSelect.innerHTML = "";
  LEVELS.forEach((levelConfig, idx) => {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    btn.innerHTML = `<span class="level-num">${levelConfig.level}</span>`;
    btn.addEventListener("click", () => {
      state.score = 0;
      el.score.textContent = 0;
      state.lives = LIVES;
      startLevel(idx);
    });
    el.levelSelect.appendChild(btn);
  });
}

// Debug gallery: every item in ITEMS with its picture (or emoji), name
// and bin, two per row, so the art can be checked without playing.
function renderDebugGallery() {
  if (!DEBUG) return;
  el.debugCount.textContent = `${ITEMS.length} items`;
  el.debugGrid.innerHTML = "";
  ITEMS.forEach((item) => {
    const bin = BIN_TYPES.find((b) => b.id === item.type);
    const card = document.createElement("div");
    card.className = "debug-card";
    if (bin) card.style.setProperty("--bin-color", bin.color);
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = localized(item.name);
      card.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.className = "item-emoji";
      span.textContent = item.emoji;
      card.appendChild(span);
    }
    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = localized(item.name);
    card.appendChild(name);
    const type = document.createElement("div");
    type.className = "debug-type";
    type.textContent = bin ? localized(bin.label) : `⚠️ unknown type "${item.type}"`;
    card.appendChild(type);
    el.debugGrid.appendChild(card);
  });
}

function renderItem(item) {
  // Remove only the previous item card — clearing the whole stage would
  // also delete the #feedback element that lives inside it.
  el.itemStage.querySelectorAll(".item-card").forEach((c) => c.remove());
  el.bins.querySelectorAll(".drop-target").forEach((b) => b.classList.remove("drop-target"));
  const card = document.createElement("div");
  card.className = "item-card";
  if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = localized(item.name);
    img.draggable = false; // stop the browser's own image dragging on PC
    card.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.className = "item-emoji";
    span.textContent = item.emoji;
    card.appendChild(span);
  }
  const label = document.createElement("div");
  label.className = "item-name";
  label.textContent = localized(item.name);
  card.appendChild(label);
  el.itemStage.appendChild(card);
  enableDrag(card);
}

// Lets the item card be dragged onto a bin. Pointer Events cover mouse,
// touch and pen alike, so this works on PC and mobile. Tapping or
// clicking a bin still works too; both end up in handleAnswer().
function enableDrag(card) {
  let drag = null; // { id, startX, startY, target } while a drag is in progress

  function binAt(x, y) {
    return [...el.bins.querySelectorAll(".bin")].find((b) => {
      const r = b.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }) || null;
  }

  // Highlights the bin currently under the pointer.
  function setTarget(bin) {
    if (drag.target === bin) return;
    if (drag.target) drag.target.classList.remove("drop-target");
    if (bin) bin.classList.add("drop-target");
    drag.target = bin;
  }

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const bin = cancelled ? null : drag.target;
    setTarget(null);
    drag = null;
    card.classList.remove("dragging");

    if (bin && !state.locked && !state.paused) {
      card.classList.add("dropped");
      handleAnswer(bin.dataset.binId, bin);
    } else {
      card.style.transform = ""; // glides back to the middle via CSS transition
    }
  }

  card.addEventListener("pointerdown", (e) => {
    if (drag || state.locked || state.paused) return;
    drag = { id: e.pointerId, startX: e.clientX, startY: e.clientY, target: null };
    card.setPointerCapture(e.pointerId);
    card.classList.add("dragging");
  });

  card.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    card.style.transform = `translate(${e.clientX - drag.startX}px, ${e.clientY - drag.startY}px)`;
    // No highlight once the item has timed out or the game is paused.
    setTarget(state.locked || state.paused ? null : binAt(e.clientX, e.clientY));
  });

  card.addEventListener("pointerup", (e) => endDrag(e, false));
  card.addEventListener("pointercancel", (e) => endDrag(e, true));
}

// Updates the current item's name in place (no pop animation replay).
function renderItemName() {
  if (!state.currentItem) return;
  const name = localized(state.currentItem.name);
  el.itemStage.querySelectorAll(".item-name").forEach((n) => (n.textContent = name));
  el.itemStage.querySelectorAll(".item-card img").forEach((img) => (img.alt = name));
}

function renderLevelLabel() {
  el.levelLabel.textContent = t("levelLabel", { level: LEVELS[state.levelIndex].level, total: LEVELS.length });
}

function renderItemCount() {
  el.itemCount.textContent = t("itemCount", { n: state.itemNumber, total: LEVELS[state.levelIndex].items });
}

function renderLevelEndTitle() {
  el.levelEndTitle.textContent = t("levelComplete", { level: LEVELS[state.levelIndex].level });
}

function renderLifeBonus() {
  el.lifeBonus.textContent = state.livesGained > 0 ? t("lifeBonus", { n: state.livesGained }) : "";
}

function renderGameOverTitle() {
  el.gameOverTitle.textContent = state.won ? t("allDone") : t("outOfLives");
}

function flashFeedback(text, good) {
  el.feedback.textContent = text;
  el.feedback.className = "feedback show " + (good ? "good" : "bad");
  setTimeout(() => {
    el.feedback.className = "feedback";
  }, 500);
}

function renderLives() {
  el.lives.textContent = "❤️".repeat(state.lives) + "🤍".repeat(Math.max(0, LIVES - state.lives));
}

function loseLife() {
  state.lives = Math.max(0, state.lives - 1);
  renderLives();
}

// Called after each item is sorted or missed: game over if no lives
// are left, level complete once all items are done, else the next item.
function continueLevel(levelConfig) {
  if (state.lives <= 0) return endGame(false);
  if (state.itemsDone >= levelConfig.items) return endLevel();
  spawnNextItem(levelConfig);
}

// Moves on after a short delay so the feedback can be seen. Does nothing
// if the player quit or restarted meanwhile; waits for resume if paused.
function continueAfter(delay, levelConfig) {
  const session = state.session;
  setTimeout(() => {
    if (session !== state.session) return;
    if (state.paused) {
      state.pendingContinue = true;
      return;
    }
    continueLevel(levelConfig);
  }, delay);
}

function spawnNextItem(levelConfig) {
  state.locked = false;
  state.currentItem = drawItem();
  renderItem(state.currentItem);
  state.itemNumber = state.itemsDone + 1;
  renderItemCount();

  state.itemTimeLeft = levelConfig.timePerItem;
  startItemTimer(levelConfig);
}

// Counts down state.itemTimeLeft; also used to resume after a pause.
function startItemTimer(levelConfig) {
  clearInterval(state.itemTimer);
  state.itemTimer = setInterval(() => {
    state.itemTimeLeft -= 100;
    el.itemTimeBar.style.width = Math.max(0, (state.itemTimeLeft / levelConfig.timePerItem) * 100) + "%";
    if (state.itemTimeLeft <= 0) {
      clearInterval(state.itemTimer);
      if (!state.locked) {
        state.locked = true;
        state.itemsDone++;
        updateScore(levelConfig.pointsWrong);
        loseLife();
        Sound.play("wrong");
        flashFeedback(t("tooSlow", { points: Math.abs(levelConfig.pointsWrong) }), false);
        continueAfter(400, levelConfig);
      }
    }
  }, 100);
}

function handleAnswer(binId, btnEl) {
  if (state.locked || state.paused || !state.currentItem) return;
  state.locked = true;
  clearInterval(state.itemTimer);

  const levelConfig = LEVELS[state.levelIndex];
  const correct = state.currentItem.type === binId;
  state.itemsDone++;

  if (correct) {
    updateScore(levelConfig.pointsCorrect);
    Sound.play("correct");
    flashFeedback(t("correct", { points: levelConfig.pointsCorrect }), true);
    btnEl.classList.add("correct");
  } else {
    updateScore(levelConfig.pointsWrong);
    loseLife();
    Sound.play("wrong");
    flashFeedback(t("wrong", { points: Math.abs(levelConfig.pointsWrong) }), false);
    btnEl.classList.add("wrong");
  }

  setTimeout(() => btnEl.classList.remove("correct", "wrong"), 350);
  continueAfter(350, levelConfig);
}

function startLevel(index) {
  state.session++;
  state.levelIndex = index;
  state.levelScore = 0;
  state.itemsDone = 0;
  state.deck = [];
  const levelConfig = LEVELS[index];

  renderLevelLabel();
  state.bins = pickBins(levelConfig);
  renderBins();
  renderLives();
  showScreen("play");
  Sound.startMusic();

  spawnNextItem(levelConfig);
}

function endLevel() {
  const isLast = state.levelIndex === LEVELS.length - 1;
  if (isLast) return endGame(true);

  Sound.stopMusic();
  renderLevelEndTitle();
  el.levelEndScore.textContent = state.levelScore;

  // Reward finishing the level with bonus lives, capped at the starting amount.
  const livesBefore = state.lives;
  state.lives = Math.min(LIVES, state.lives + LIFE_BONUS_PER_LEVEL);
  state.livesGained = state.lives - livesBefore;
  renderLifeBonus();
  showScreen("levelEnd");
}

// won = true when all levels are finished, false when out of lives.
function endGame(won) {
  clearInterval(state.itemTimer);
  Sound.stopMusic();
  state.won = won;
  renderGameOverTitle();
  el.finalScore.textContent = state.score;
  showScreen("gameOver");
}

function pauseGame() {
  if (state.paused || !screens.play.classList.contains("active")) return;
  state.paused = true;
  clearInterval(state.itemTimer);
  Sound.stopMusic();
  el.pauseOverlay.classList.add("show");
}

function resumeGame() {
  if (!state.paused) return;
  state.paused = false;
  el.pauseOverlay.classList.remove("show");
  Sound.startMusic();

  const levelConfig = LEVELS[state.levelIndex];
  if (state.pendingContinue) {
    // The last item's feedback delay ran out while paused.
    state.pendingContinue = false;
    continueLevel(levelConfig);
  } else if (!state.locked) {
    // Pick up the countdown where it stopped.
    startItemTimer(levelConfig);
  }
}

function quitGame() {
  state.paused = false;
  state.pendingContinue = false;
  el.pauseOverlay.classList.remove("show");
  goToLevelSelect();
}

function goToLevelSelect() {
  state.session++;
  clearInterval(state.itemTimer);
  Sound.startMusic();
  state.score = 0;
  el.score.textContent = 0;
  showScreen("start");
}

function updateMuteButton() {
  const muted = Sound.isMuted();
  el.muteBtn.textContent = muted ? "🔇" : "🔊";
  el.muteBtn.setAttribute("aria-label", muted ? t("unmute") : t("mute"));
}

// The language the toggle button switches to (cycles through TEXT).
function nextLanguage() {
  const langs = Object.keys(TEXT);
  return langs[(langs.indexOf(lang) + 1) % langs.length];
}

// Re-applies every piece of on-screen text in the current language.
// Safe to call on any screen, including mid-level.
function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  el.lives.setAttribute("aria-label", t("lives"));
  el.pauseBtn.setAttribute("aria-label", t("pause"));
  el.langBtn.textContent = TEXT[nextLanguage()].langCode;
  el.langBtn.setAttribute("aria-label", t("switchLanguage"));
  updateMuteButton();
  renderLegend();
  renderBinLabels();
  renderItemName();
  renderLevelLabel();
  renderItemCount();
  renderLevelEndTitle();
  renderLifeBonus();
  renderGameOverTitle();
  renderDebugGallery();
}

el.langBtn.addEventListener("click", () => {
  lang = nextLanguage();
  applyLanguage();
});

el.pauseBtn.addEventListener("click", pauseGame);
el.resumeBtn.addEventListener("click", resumeGame);
el.quitBtn.addEventListener("click", quitGame);

el.muteBtn.addEventListener("click", () => {
  Sound.toggleMute();
  updateMuteButton();
});

el.nextLevelBtn.addEventListener("click", () => {
  startLevel(state.levelIndex + 1);
});

el.levelEndSelectBtn.addEventListener("click", goToLevelSelect);
el.restartBtn.addEventListener("click", goToLevelSelect);

if (DEBUG) {
  el.debugBtn.hidden = false;
  el.debugBtn.addEventListener("click", () => showScreen("debug"));
  el.debugBackBtn.addEventListener("click", () => showScreen("start"));
}

renderLevelSelect();
renderBestScore();
applyLanguage(); // also renders the legend and the mute button
Sound.startMusic(); // home screen music (starts on the first tap if the browser blocks autoplay)
