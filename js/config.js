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
//   - image: a path to a picture of the bin, e.g. "assets/bins/plastic.png"
// If "image" is set it is used instead of the built-in colored can icon.
// TO ADD YOUR OWN ART: drop a PNG (transparent background works best,
// ~200x200px) into assets/bins/ and set image: "assets/bins/yourfile.png"
// "label" has one entry per language (see section 6).
const BIN_TYPES = [
  { id: "plastic", label: { mk: "Пластика", en: "Plastic" }, color: "#2f9df4", image: null },
  { id: "glass", label: { mk: "Стакло", en: "Glass" }, color: "#2ecc71", image: null },
  { id: "metal", label: { mk: "Метал", en: "Metal" }, color: "#9aa5b1", image: null },
  { id: "paper", label: { mk: "Хартија", en: "Paper" }, color: "#f5a623", image: null },
  { id: "organic", label: { mk: "Органски", en: "Organic" }, color: "#8d5524", image: null },
];

// ---------- 2. GARBAGE ITEMS ----------
// Each item needs: name (one entry per language, see section 6),
// type (must match a BIN_TYPES id), and either
//   - emoji: any emoji character (quick, no files needed), or
//   - image: a path to a picture, e.g. "assets/items/bottle.png"
// If "image" is set it is used instead of the emoji.
// TO ADD YOUR OWN ART: drop a PNG (transparent background works best,
// ~200x200px) into assets/items/ and set image: "assets/items/yourfile.png"
const ITEMS = [
  // Tip: two items may share an emoji only if they go in the SAME bin,
  // otherwise kids can't tell which bin is right from the picture.

  // --- Plastic (9) ---
  { name: { mk: "Пластично шише", en: "Plastic Bottle" }, type: "plastic", emoji: "🧴", image: null },
  { name: { mk: "Пластична кеса", en: "Plastic Bag" }, type: "plastic", emoji: "🛍️", image: null },
  { name: { mk: "Чаша од јогурт", en: "Yogurt Cup" }, type: "plastic", emoji: "🥤", image: null },
  { name: { mk: "Сламка", en: "Drinking Straw" }, type: "plastic", emoji: "🥤", image: null },
  { name: { mk: "Шише од шампон", en: "Shampoo Bottle" }, type: "plastic", emoji: "🧴", image: null },
  { name: { mk: "Пластична чаша", en: "Plastic Cup" }, type: "plastic", emoji: "🥤", image: null },
  { name: { mk: "Пластична кофа", en: "Plastic Bucket" }, type: "plastic", emoji: "🪣", image: null },
  { name: { mk: "Капаче од шише", en: "Bottle Cap" }, type: "plastic", emoji: "🔘", image: null },
  { name: { mk: "Шише од детергент", en: "Detergent Bottle" }, type: "plastic", emoji: "🧴", image: null },

  // --- Glass (8) ---
  // Only glass packaging (bottles & jars). Drinking glasses, bowls, vases,
  // mirrors and light bulbs are made differently and don't belong here.
  { name: { mk: "Стаклена тегла", en: "Glass Jar" }, type: "glass", emoji: "🫙", image: null },
  { name: { mk: "Стаклено шише", en: "Glass Bottle" }, type: "glass", emoji: "🍾", image: null },
  { name: { mk: "Шише од вино", en: "Wine Bottle" }, type: "glass", emoji: "🍷", image: null },
  { name: { mk: "Шишенце од парфем", en: "Perfume Bottle" }, type: "glass", emoji: "🫙", image: null },
  { name: { mk: "Тегла од џем", en: "Jam Jar" }, type: "glass", emoji: "🫙", image: null },
  { name: { mk: "Тегла од кисели краставички", en: "Pickle Jar" }, type: "glass", emoji: "🫙", image: null },
  { name: { mk: "Тегла од мед", en: "Honey Jar" }, type: "glass", emoji: "🍯", image: null },
  { name: { mk: "Шише од пиво", en: "Beer Bottle" }, type: "glass", emoji: "🍺", image: null },

  // --- Metal (7) ---
  { name: { mk: "Лименка од сок", en: "Soda Can" }, type: "metal", emoji: "🥫", image: null },
  { name: { mk: "Конзерва", en: "Tin Can" }, type: "metal", emoji: "🥫", image: null },
  { name: { mk: "Алуминиумска фолија", en: "Aluminum Foil" }, type: "metal", emoji: "🔩", image: null },
  { name: { mk: "Метална лажица", en: "Metal Spoon" }, type: "metal", emoji: "🥄", image: null },
  { name: { mk: "Шајка", en: "Nail" }, type: "metal", emoji: "🔩", image: null },
  { name: { mk: "Стари клучеви", en: "Old Keys" }, type: "metal", emoji: "🔑", image: null },
  { name: { mk: "Безбедносна игла", en: "Safety Pin" }, type: "metal", emoji: "🧷", image: null },

  // --- Paper (9) ---
  { name: { mk: "Весник", en: "Newspaper" }, type: "paper", emoji: "📰", image: null },
  { name: { mk: "Списание", en: "Magazine" }, type: "paper", emoji: "📖", image: null },
  { name: { mk: "Картонска кутија", en: "Cardboard Box" }, type: "paper", emoji: "📦", image: null },
  { name: { mk: "Кутија од житарки", en: "Cereal Box" }, type: "paper", emoji: "📦", image: null },
  { name: { mk: "Хартија за печатење", en: "Printer Paper" }, type: "paper", emoji: "📄", image: null },
  { name: { mk: "Плико", en: "Envelope" }, type: "paper", emoji: "✉️", image: null },
  { name: { mk: "Книга", en: "Book" }, type: "paper", emoji: "📚", image: null },
  { name: { mk: "Кутија за јајца", en: "Egg Carton" }, type: "paper", emoji: "📦", image: null },
  { name: { mk: "Ролна од тоалетна хартија", en: "Toilet Paper Roll" }, type: "paper", emoji: "🧻", image: null },

  // --- Organic (9) ---
  { name: { mk: "Кора од банана", en: "Banana Peel" }, type: "organic", emoji: "🍌", image: null },
  { name: { mk: "Огризок од јаболко", en: "Apple Core" }, type: "organic", emoji: "🍎", image: null },
  { name: { mk: "Остатоци од храна", en: "Leftover Food" }, type: "organic", emoji: "🍕", image: null },
  { name: { mk: "Кора од портокал", en: "Orange Peel" }, type: "organic", emoji: "🍊", image: null },
  { name: { mk: "Лушпи од јајца", en: "Eggshells" }, type: "organic", emoji: "🥚", image: null },
  { name: { mk: "Лушпи од морков", en: "Carrot Peels" }, type: "organic", emoji: "🥕", image: null },
  { name: { mk: "Талог од кафе", en: "Coffee Grounds" }, type: "organic", emoji: "☕", image: null },
  { name: { mk: "Кора од леб", en: "Bread Crust" }, type: "organic", emoji: "🍞", image: null },
  { name: { mk: "Искосена трева", en: "Grass Clippings" }, type: "organic", emoji: "🌱", image: null },
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
