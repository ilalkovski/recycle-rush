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

#### Image sizes
Big images make the game slow to load online (e.g. on GitHub Pages).
Items are shown at most 120px wide, so 240px (sharp on retina screens)
is plenty. Convert each new PNG to a small WebP and point `image` at
the `.webp` file. With [ImageMagick](https://imagemagick.org) and
`cwebp` (`brew install imagemagick webp`), run from `assets/items/`:

```
magick bottle.png -resize '240x240>' -strip /tmp/x.png && cwebp -q 85 -alpha_q 100 /tmp/x.png -o bottle.webp
```

The original PNGs are kept next to the `.webp` files; only the `.webp`
files are loaded by the game.

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

## Image credits
Item photos from Wikimedia Commons, cut out and resized for the game:

- `assets/items/straws.png` — "Eight drinking straws" by Horia Varlan,
  [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://commons.wikimedia.org/wiki/File:Eight_drinking_straws_(4273846588).jpg))
- `assets/items/plastic_cup.png` — "Party red plastic cup" by Lenny Maidana
  (edited by Vitor Perrut), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:Party_red_plastic_cup.png))
- `assets/items/plastic_bag.png` — "Black plastic bag on white counter" by 999real, CC0
  ([source](https://commons.wikimedia.org/wiki/File:Black_plastic_bag_on_white_counter.jpg))
- `assets/items/bottle_cap.png` — "Green bottle cap" by XCNXMONSTERTRUCK20, CC0
  ([source](https://commons.wikimedia.org/wiki/File:Green_bottle_cap.jpg))
- `assets/items/detergent_bottle.png` — "Liquid detergent" by Mk2010,
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Liquid_detergent.JPG))
- `assets/items/glass_bottle.png` — "Acqua Panna mineral water in a glass bottle" by Smuconlaw,
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:Acqua_Panna_mineral_water_in_a_glass_bottle_-_20140408.jpg))
- `assets/items/broken_glass.png` — "Broken bottle" by kallerna,
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Broken_bottle.jpg))
- `assets/items/perfume_bottle.png` — "CHANEL No5 parfum" by arz, public domain
  ([source](https://commons.wikimedia.org/wiki/File:CHANEL_No5_parfum.jpg))
- `assets/items/pickle_jar.png` — "Pickled cucumber 2" by Tiia Monto,
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:Pickled_cucumber_2.jpg))
- `assets/items/jam_jar.png` — "Jam Kruipbraam" by pdreijnders,
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Jam_Kruipbraam.jpeg))
- `assets/items/juice_bottle.png` — "Bottle of grape juice" by Oyp,
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Bottle_of_grape_juice.jpeg))
- `assets/items/aluminum_foil.png` — "A sample of aluminium foil on a piece of paper" by Vitaium, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:A_sample_of_aluminium_foil_on_a_piece_of_paper.jpg))
- `assets/items/apple_core.png` — "Core" by retewphoto, CC0
  ([source](https://www.flickr.com/photos/89287075@N04/8152898820))
- `assets/items/book.png` — "Books: Maya Cosmos" by planeta, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/19047782@N00/5807979751))
- `assets/items/bread_crust.png` — "Heel" by drewgstephens, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  ([source](https://www.flickr.com/photos/22809317@N04/3366775895))
- `assets/items/cardboard_box.png` — "Box.agr" by ArnoldReinhold, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Box.agr.jpg))
- `assets/items/carrot_peels.png` — "Peeling carrots" by Afifa Afrin, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:Peeling_carrots.jpg))
- `assets/items/cereal_box.png` — "Retro Cornflakes Box." by Rex Roof, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/18199354@N00/3028044461))
- `assets/items/coffee_grounds.png` — "coffee_grounds" by How can I recycle this, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/87481332@N00/161604527))
- `assets/items/egg_carton.png` — "Country eggs" by Andrei!, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  ([source](https://www.flickr.com/photos/29465285@N00/4158912568))
- `assets/items/eggshells.png` — "Crushed eggshells in a pot. DIY fertilizer" by Ivan Radic, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/26344495@N05/50262747381))
- `assets/items/envelope.png` — "old papers" by Joanna Bourne, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/66992990@N00/6773474225))
- `assets/items/glass_jar.png` — "Empty Clear Jar (51330638811)" by Alabama Extension, CC0
  ([source](https://commons.wikimedia.org/wiki/File:Empty_Clear_Jar_(51330638811).jpg))
- `assets/items/grass_clippings.png` — "pile of grass" by peretzpup, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)
  ([source](https://www.flickr.com/photos/60436643@N00/1793986790))
- `assets/items/honey_jar.png` — "Antique Glass Honey Jar With Rusted Metal Cap (31009798197)" by Cindy Shebley, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://commons.wikimedia.org/wiki/File:Antique_Glass_Honey_Jar_With_Rusted_Metal_Cap_(31009798197).jpg))
- `assets/items/leftover_food.png` — "Half-eaten vietnamese sandwich" by karen_neoh, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/50266725@N02/6145759251))
- `assets/items/magazine.png` — "Kazoo Magazine, Issue 24" by BJCHK, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)
  ([source](https://commons.wikimedia.org/wiki/File:Kazoo_Magazine,_Issue_24.jpg))
- `assets/items/metal_spoon.png` — "Cuillère pour bébé Art Déco" by Lionel Allorge, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Cuill%C3%A8re_pour_b%C3%A9b%C3%A9_Art_D%C3%A9co.jpg))
- `assets/items/nail.png` — "Nail 01" by Shams948, CC0
  ([source](https://commons.wikimedia.org/wiki/File:Nail_01.jpg))
- `assets/items/newspaper.png` — "Folded Newspaper" by abdillaamy, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0)
  ([source](https://sketchfab.com/3d-models/4fc14ea5129b4ea3b34a22844a6f1b3f))
- `assets/items/old_keys.png` — "Two keys and key ring" by themet, CC0
  ([source](https://www.rawpixel.com/image/8285889/two-keys-and-key-ring))
- `assets/items/orange_peel.png` — "Five Spiral Strips Orange Peeling" by fdecomite, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/21649179@N00/17143365469))
- `assets/items/plastic_bucket.png` — "The Childrens Museum of Indianapolis - Sandbox and Beach Toys" by unknown author, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:The_Childrens_Museum_of_Indianapolis_-_Sandbox_and_Beach_Toys.jpg))
- `assets/items/printer_paper.png` — "Wrinkled paper" by Turinboy, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://commons.wikimedia.org/wiki/File:Wrinkled_paper.jpg))
- `assets/items/safety_pin.png` — "Safety Pin" by Haragayato, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Safety_Pin.jpg))
- `assets/items/shampoo_bottle.png` — "Dove shampoo bottle" by Ranjima np, CC0
  ([source](https://commons.wikimedia.org/wiki/File:Dove_shampoo_bottle.jpg))
- `assets/items/toilet_paper_roll.png` — "code 71604592781" by uair01, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0)
  ([source](https://www.flickr.com/photos/56759497@N00/6294764262))
- `assets/items/milk_bottle.png` — "Milk-bottle" by FiveRings (talk), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)
  ([source](https://commons.wikimedia.org/wiki/File:Milk-bottle.jpg))
