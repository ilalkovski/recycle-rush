/* ============================================================
   RECYCLE RUSH — CONFIG
   ------------------------------------------------------------
   This is the ONLY file you need to touch to customize the game:
   - swap/add garbage items (just images or emoji, no code needed)
   - change bin types and colors
   - set the number of lives
   - edit the 10 levels (items, speed, points, which bins are active)
   - edit the on-screen text in each language (Macedonian & English)
   ============================================================ */

// ---------- 1. BIN / CATEGORY TYPES ----------
// Add or remove categories here. "color" is used for the bin's theme
// color (border + the built-in can icon).
//   - image: a path to a picture of the bin, e.g. "assets/bins/plastic.webp"
// If "image" is set it is used instead of the built-in colored can icon.
// TO ADD YOUR OWN ART: drop a picture (transparent background works best)
// into assets/bins/ and set image: "assets/bins/yourfile.webp"
// Keep files small so the game loads fast online: max 240x240px, and
// WebP is ~10x smaller than PNG (see "Image sizes" in README.md).
// "label" has one entry per language (see section 6).
const BIN_TYPES = [
  { id: "plastic", label: { mk: "Пластика", en: "Plastic" }, color: "#2f9df4", image: "assets/bins/plastic.webp" },
  { id: "glass", label: { mk: "Стакло", en: "Glass" }, color: "#2ecc71", image: "assets/bins/glass.webp" },
  { id: "metal", label: { mk: "Метал", en: "Metal" }, color: "#9aa5b1", image: "assets/bins/metal.webp" },
  { id: "paper", label: { mk: "Хартија", en: "Paper" }, color: "#f5a623", image: "assets/bins/paper.webp" },
  { id: "organic", label: { mk: "Органски", en: "Organic" }, color: "#8d5524", image: "assets/bins/organic.webp" },
];

// ---------- 2. GARBAGE ITEMS ----------
// Each item needs: name (one entry per language, see section 6),
// type (must match a BIN_TYPES id), and either
//   - emoji: any emoji character (quick, no files needed), or
//   - image: a path to a picture, e.g. "assets/items/bottle.webp"
// If "image" is set it is used instead of the emoji.
// TO ADD YOUR OWN ART: drop a picture (transparent background works best)
// into assets/items/ and set image: "assets/items/yourfile.webp"
// Keep files small so the game loads fast online: max 240x240px, and
// WebP is ~10x smaller than PNG (see "Image sizes" in README.md).
const ITEMS = [
  // Tip: two items may share an emoji only if they go in the SAME bin,
  // otherwise kids can't tell which bin is right from the picture.

  // --- Plastic (9) ---
  { name: { mk: "Пластично шише", en: "Plastic Bottle" }, type: "plastic", emoji: "🧴", image:"assets/items/plastic_bottle.webp" },
  { name: { mk: "Пластична кеса", en: "Plastic Bag" }, type: "plastic", emoji: "🛍️", image: "assets/items/plastic_bag.webp" },
  { name: { mk: "Чаша од јогурт", en: "Yogurt Cup" }, type: "plastic", emoji: "🥤", image: "assets/items/yogurt_cup.webp" },
  { name: { mk: "Сламка", en: "Drinking Straw" }, type: "plastic", emoji: "🥤", image: "assets/items/straws.webp" },
  { name: { mk: "Шише од шампон", en: "Shampoo Bottle" }, type: "plastic", emoji: "🧴", image: "assets/items/shampoo_bottle.webp" },
  { name: { mk: "Пластична чаша", en: "Plastic Cup" }, type: "plastic", emoji: "🥤", image: "assets/items/plastic_cup.webp" },
  { name: { mk: "Пластична кофа", en: "Plastic Bucket" }, type: "plastic", emoji: "🪣", image: "assets/items/plastic_bucket.webp" },
  { name: { mk: "Капаче од шише", en: "Bottle Cap" }, type: "plastic", emoji: "🔘", image: "assets/items/bottle_cap.webp" },
  { name: { mk: "Шише од детергент", en: "Detergent Bottle" }, type: "plastic", emoji: "🧴", image: "assets/items/detergent_bottle.webp" },

  // --- Glass (9) ---
  // Only glass packaging (bottles & jars). Drinking glasses, bowls, vases,
  // mirrors and light bulbs are made differently and don't belong here.
  { name: { mk: "Стаклена тегла", en: "Glass Jar" }, type: "glass", emoji: "🫙", image: "assets/items/glass_jar.webp" },
  { name: { mk: "Стаклено шише", en: "Glass Bottle" }, type: "glass", emoji: "🫗", image: "assets/items/glass_bottle.webp" },
  { name: { mk: "Шишенце од парфем", en: "Perfume Bottle" }, type: "glass", emoji: "🫙", image: "assets/items/perfume_bottle.webp" },
  { name: { mk: "Тегла од џем", en: "Jam Jar" }, type: "glass", emoji: "🫙", image: "assets/items/jam_jar.webp" },
  { name: { mk: "Тегла од кисели краставички", en: "Pickle Jar" }, type: "glass", emoji: "🫙", image: "assets/items/pickle_jar.webp" },
  { name: { mk: "Тегла од мед", en: "Honey Jar" }, type: "glass", emoji: "🍯", image: "assets/items/honey_jar.webp" },
  { name: { mk: "Шише од сок", en: "Juice Bottle" }, type: "glass", emoji: "🧃", image: "assets/items/juice_bottle.webp" },
  { name: { mk: "Скршено шише", en: "Broken Glass Bottle" }, type: "glass", emoji: "🫙", image: "assets/items/broken_glass.webp" },

  // --- Metal (7) ---
  { name: { mk: "Лименка од сок", en: "Soda Can" }, type: "metal", emoji: "🥫", image: "assets/items/can_transparent_final.webp" },
  { name: { mk: "Конзерва", en: "Tin Can" }, type: "metal", emoji: "🥫", image: "assets/items/food_can.webp" },
  { name: { mk: "Алуминиумска фолија", en: "Aluminum Foil" }, type: "metal", emoji: "🔩", image: "assets/items/aluminum_foil.webp" },
  { name: { mk: "Метална лажица", en: "Metal Spoon" }, type: "metal", emoji: "🥄", image: "assets/items/metal_spoon.webp" },
  { name: { mk: "Шајка", en: "Nail" }, type: "metal", emoji: "🔩", image: "assets/items/nail.webp" },
  { name: { mk: "Стари клучеви", en: "Old Keys" }, type: "metal", emoji: "🔑", image: "assets/items/old_keys.webp" },
  { name: { mk: "Безбедносна игла", en: "Safety Pin" }, type: "metal", emoji: "🧷", image: "assets/items/safety_pin.webp" },

  // --- Paper (9) ---
  { name: { mk: "Млеко во картон", en: "Milk carton" }, type: "paper", emoji: "📰", image: "assets/items/milk_carton.webp" },
  { name: { mk: "Картонска кутија", en: "Cardboard Box" }, type: "paper", emoji: "📦", image: "assets/items/cardboard_box.webp" },
  { name: { mk: "Кутија за храна", en: "Food box" }, type: "paper", emoji: "📦", image: "assets/items/food_box.webp" },
  { name: { mk: "Хартија за печатење", en: "Printer Paper" }, type: "paper", emoji: "📄", image: "assets/items/printer_paper.webp" },
  { name: { mk: "Плико", en: "Envelope" }, type: "paper", emoji: "✉️", image: "assets/items/envelope.webp" },
  { name: { mk: "Кутија за јајца", en: "Egg Carton" }, type: "paper", emoji: "📦", image: "assets/items/egg_carton.webp" },
  { name: { mk: "Ролна од тоалетна хартија", en: "Toilet Paper Roll" }, type: "paper", emoji: "🧻", image: "assets/items/toilet_paper_roll.webp" },

  // --- Organic (9) ---
  { name: { mk: "Кора од банана", en: "Banana Peel" }, type: "organic", emoji: "🍌", image: "assets/items/banana_peel.webp" },
  { name: { mk: "Огризок од јаболко", en: "Apple Core" }, type: "organic", emoji: "🍎", image: "assets/items/apple_core.webp" },
  { name: { mk: "Остатоци од храна", en: "Leftover Food" }, type: "organic", emoji: "🍕", image: "assets/items/leftover_food.webp" },
  { name: { mk: "Кора од портокал", en: "Orange Peel" }, type: "organic", emoji: "🍊", image: "assets/items/orange_peel.webp" },
  { name: { mk: "Лушпи од јајца", en: "Eggshells" }, type: "organic", emoji: "🥚", image: "assets/items/eggshells.webp" },
  { name: { mk: "Лушпи од морков", en: "Carrot Peels" }, type: "organic", emoji: "🥕", image: "assets/items/carrot_peels.webp" },
  { name: { mk: "Кора од лубеница", en: "Watermelon bark" }, type: "organic", emoji: "☕", image: "assets/items/watermelon_bark.webp" },
  { name: { mk: "Лушпа од кромид", en: "Onion skin" }, type: "organic", emoji: "🍞", image: "assets/items/onion_skin.webp" },
  { name: { mk: "Искосена трева", en: "Grass Clippings" }, type: "organic", emoji: "🌱", image: "assets/items/grass_clippings.webp" },
];

// ---------- 3. LIVES ----------
// How many lives the player starts with. A wrong sort or a miss costs
// one life; at zero it's game over. Lives carry over between levels and
// reset when a game is started from the level select screen.
const LIVES = 3;

// Lives given back for completing a level (never more than LIVES).
// Set to 0 to turn the bonus off.
const LIFE_BONUS_PER_LEVEL = 1;

// ---------- 4. LEVELS ----------
// 10 levels, each getting a bit harder. You can freely edit any field:
//   items          -> how many items to sort to finish the level
//   timePerItem    -> ms the player has to sort each item before it
//                      counts as a miss (lower = faster/harder)
//   bins           -> how many bins are active this level (fewer = easier).
//                      Which bin types, and their order, are picked at
//                      random each time the level starts.
//                      To use a fixed set instead, give a list of
//                      BIN_TYPES ids, e.g. bins: ["plastic", "organic"]
//   pointsCorrect  -> points earned for a correct sort
//   pointsWrong    -> points lost for a wrong sort or a miss (use negative)
const LEVELS = [
  { level: 1, items: 8, timePerItem: 6500, bins: 2, pointsCorrect: 10, pointsWrong: -5 },
  { level: 2, items: 8, timePerItem: 6200, bins: 3, pointsCorrect: 10, pointsWrong: -5 },
  { level: 3, items: 10, timePerItem: 6200, bins: 3, pointsCorrect: 12, pointsWrong: -6 },
  { level: 4, items: 10, timePerItem: 5800, bins: 4, pointsCorrect: 12, pointsWrong: -6 },
  { level: 5, items: 10, timePerItem: 5400, bins: 5, pointsCorrect: 14, pointsWrong: -7 },
  { level: 6, items: 12, timePerItem: 5000, bins: 5, pointsCorrect: 14, pointsWrong: -7 },
  { level: 7, items: 12, timePerItem: 4400, bins: 5, pointsCorrect: 16, pointsWrong: -8 },
  { level: 8, items: 12, timePerItem: 4200, bins: 5, pointsCorrect: 16, pointsWrong: -8 },
  { level: 9, items: 14, timePerItem: 3800, bins: 5, pointsCorrect: 18, pointsWrong: -9 },
  { level: 10, items: 15, timePerItem: 3400, bins: 5, pointsCorrect: 20, pointsWrong: -10 },
];

// ---------- 5. SOUNDS ----------
// Leave a path as null to use the built-in generated sound (no files
// needed). To use your own audio, drop an mp3/wav into assets/sounds/
// and set the path, e.g. music: "assets/sounds/music.mp3".
//   music          -> loops in the background on the home screen and
//                      while a level is played
//   correct        -> plays on a correct sort
//   wrong          -> plays on a wrong sort or when time runs out
//   musicVolume    -> 0 (silent) to 1 (full)
//   effectsVolume  -> 0 (silent) to 1 (full)
const SOUNDS = {
  music: null,
  correct: null,
  wrong: null,
  musicVolume: 0.4,
  effectsVolume: 0.6,
};

// ---------- 6. LANGUAGES ----------
// All on-screen text, one block per language. The language button in the
// top-left corner switches between them. The choice is NOT saved — the
// game always opens in DEFAULT_LANGUAGE.
// Words in {curly braces} are filled in by the game, keep them as-is.
// Bin labels and item names are translated in sections 1 and 2.
const DEFAULT_LANGUAGE = "mk";

const TEXT = {
  mk: {
    langCode: "МК",
    switchLanguage: "Префрли на англиски",
    title: "♻️ Рециклажна трка",
    subtitle: "Фрли го отпадот во вистинската канта пред да истече времето!",
    chooseLevel: "Избери ниво:",
    bestScore: "🏆 Најдобар резултат",
    hint: "10 нивоа · 3 животи · освојувај поени за точно сортирање",
    levelLabel: "Ниво {level} / {total}",
    itemCount: "Предмет {n} / {total}",
    score: "Поени",
    lives: "Животи",
    correct: "Точно! +{points}",
    wrong: "Упс! -{points}",
    tooSlow: "Премногу бавно! -{points}",
    levelComplete: "Нивото {level} е завршено!",
    pointsThisLevel: "Поени во ова ниво",
    lifeBonus: "+{n} ❤️ бонус живот",
    nextLevel: "Следно ниво",
    levelSelect: "Избор на ниво",
    allDone: "🎉 Готово!",
    outOfLives: "💔 Немаш повеќе животи!",
    finalScore: "Конечен резултат",
    pause: "Пауза",
    paused: "⏸️ Пауза",
    pausedHint: "Сакаш да продолжиш или да ја затвориш играта?",
    continue: "Продолжи",
    quitGame: "Затвори ја играта",
    mute: "Исклучи звук",
    unmute: "Вклучи звук",
  },
  en: {
    langCode: "EN",
    switchLanguage: "Switch to Macedonian",
    title: "♻️ Recycle Rush",
    subtitle: "Sort the trash into the right bin before time runs out!",
    chooseLevel: "Choose a level to play:",
    bestScore: "🏆 Best Score",
    hint: "10 levels · 3 lives · earn points for correct sorting",
    levelLabel: "Level {level} / {total}",
    itemCount: "Item {n} / {total}",
    score: "Score",
    lives: "Lives",
    correct: "Correct! +{points}",
    wrong: "Oops! -{points}",
    tooSlow: "Too slow! -{points}",
    levelComplete: "Level {level} complete!",
    pointsThisLevel: "Points this level",
    lifeBonus: "+{n} ❤️ bonus life",
    nextLevel: "Next Level",
    levelSelect: "Level Select",
    allDone: "🎉 All done!",
    outOfLives: "💔 Out of lives!",
    finalScore: "Final Score",
    pause: "Pause",
    paused: "⏸️ Paused",
    pausedHint: "Do you want to continue or quit the game?",
    continue: "Continue",
    quitGame: "Quit game",
    mute: "Mute sound",
    unmute: "Unmute sound",
  },
};
// ---------- 7. DEBUG ----------
// A "🐞 All items" button on the start screen opens a gallery of every
// garbage item with its picture and name, to check how they look.
// It only shows up while developing: when the game is opened from a
// local file, localhost / 127.0.0.1, or with ?debug in the address
// (e.g. index.html?debug). On the published site it stays hidden.
// Set to true to always show it, or false to never show it.
const DEBUG = ["localhost", "127.0.0.1", ""].includes(location.hostname) ||
  new URLSearchParams(location.search).has("debug");

