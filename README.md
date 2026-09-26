# Recycle Rush 🗑️♻️

A tiny, no-build-tools browser game to teach kids which garbage goes in
which bin (plastic, glass, metal, paper, organic). Click the item, then
click the matching bin before the item's timer runs out. Correct = points,
wrong (or too slow) = points lost and one life gone. You have 3 lives;
lose them all and it's game over. 10 levels, getting faster/harder.

## How to run it

No installation needed. Just open `index.html` in a browser (double‑click
it, or drag it into a browser tab). That's it — plain HTML/CSS/JS.

If your browser blocks local images from loading (rare, only matters if
you add your own picture assets), instead run a tiny local server from
this folder, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## How to customize — everything lives in `js/config.js`

You should never need to touch `game.js` or `style.css` for the changes
below.

### 1. Change / add garbage items
Edit the `ITEMS` array. Each item needs a `name`, a `type` (must match
one of the `BIN_TYPES` ids), and either an `emoji` (fastest — just paste
any emoji) or an `image` path.

```js
{ name: "Milk Carton", type: "paper", emoji: "🥛", image: null },
```

### 2. Use your own pictures instead of emoji
1. Drop a PNG/JPG into `assets/items/` (square, transparent background,
   ~200x200px works best).
2. Point the item at it:

```js
{ name: "Plastic Bottle", type: "plastic", emoji: "🧴", image: "assets/items/bottle.png" },
```

When `image` is set it's used instead of the emoji automatically.

### 3. Change the bins/categories
Edit `BIN_TYPES` — add, remove, rename, or recolor a bin. If you add a
new bin id, give it enough items of that `type`; levels pick their bins
at random, so any bin can show up.

To use your own bin picture instead of the built-in colored can, drop a
PNG into `assets/bins/` and set its `image`:

```js
{ id: "plastic", label: "Plastic", color: "#2f9df4", image: "assets/bins/plastic.png" },
```

When `image` is set it's used on both the bin buttons and the home
screen legend. The `color` is still used for the bin's border.

### 4. Change the number of lives
Set `LIVES` (default `3`). A wrong sort or a miss costs one life. Lives
carry over between levels and reset when you pick a level from the
home screen.

Completing a level gives back `LIFE_BONUS_PER_LEVEL` lives (default `1`),
never going above `LIVES`. Set it to `0` to turn the bonus off.

### 5. Change the 10 levels
Edit the `LEVELS` array. Per level you control:
- `items` — how many items must be sorted to finish the level
- `timePerItem` — how long the player has to sort each item, in
  milliseconds (lower = harder/faster)
- `bins` — how many bins are shown that level. The bin types and their
  order are picked at random each time the level starts. Use a list of
  ids instead (e.g. `["plastic", "organic"]`) for a fixed set.
- `pointsCorrect` / `pointsWrong` — scoring for right/wrong answers

You can add an 11th level, remove some, or reorder — the game just loops
through the `LEVELS` array in order.

### 6. Change the sounds
Background music plays on the home screen and during each level
(browsers only allow sound after the first tap or click, so it may
start then), with a "ding" for correct
answers and a "bwomp" for wrong or missed ones. The 🔊 button in the
top-right corner (on every screen) mutes everything, and the browser
remembers the choice for next time. By default all sounds are generated in code,
so no files are needed.

To use your own audio, drop mp3/wav files into `assets/sounds/` and set
the paths in `SOUNDS`:

```js
const SOUNDS = {
  music: "assets/sounds/music.mp3",
  correct: "assets/sounds/correct.mp3",
  wrong: null, // null keeps the built-in sound
  musicVolume: 0.4,
  effectsVolume: 0.6,
};
```

### 7. Change the text / languages
The game is in Macedonian by default, with English available. The
button in the top-left corner switches language on any screen. The
choice is not saved, so the game always opens in `DEFAULT_LANGUAGE`.

All on-screen text lives in `TEXT` in `js/config.js`, one block per
language. Bin labels and item names have one entry per language:

```js
{ name: { mk: "Пластично шише", en: "Plastic Bottle" }, type: "plastic", emoji: "🧴", image: null },
```

A plain string (`name: "Plastic Bottle"`) also works; it's shown the
same in every language.

## Best score
The highest score is saved in the browser's `localStorage` (key
`recycleRush.bestScore`) and shown on the home screen. It's saved the
moment it's beaten, so it counts even if you quit mid-game. It's stored
per browser and device. To reset it, run this in the browser console:

```js
localStorage.removeItem("recycleRush.bestScore")
```
