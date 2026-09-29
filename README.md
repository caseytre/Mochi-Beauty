# Mochi Beauty

Mochi is the pixel-art mascot for **Mochi Beauty** (`@mochiiibeauty`), a faceless
beauty/lifestyle TikTok account. This repo holds Mochi's base art and a small,
reusable HTML/CSS/JS "rig" for animating her without hand-building a new video
pipeline every time.

## Why this exists

The first version of Mochi was a painted illustration animated frame-by-frame
in Python (PIL), which meant every new pose needed its own custom pixel-warp
code (see git history if curious). That was fragile and slow to extend, and
still had visible JPEG artifacts no matter the resolution.

Mochi's base art is now **pure code**, a numpy script builds her out of math
(ellipses for the head/body/paws, a circle-chain for the tail, a custom
triangle function for the ears) onto a pixel grid, then outputs flat-colored
`<rect>` elements as an SVG. No source photo or AI-generated image is
involved anywhere, so there's no compression noise or color fringing to
fight, ever. Animation is CSS/JS on top of that SVG:

- **Expressions/props are swaps, not redraws.** The base sprite never
  changes; small overlays (heart, music note, etc.) toggle on top of it via
  CSS classes.
- **Movement is CSS keyframes** (idle bob, prop pop-in) instead of
  per-frame image manipulation.
- **The speech bubble is real DOM + Web Audio**, not a baked-in caption:
  text types on letter by letter with a synthesized pitch-blip per
  character (classic Animal Crossing "Animalese" effect), no audio files
  needed. It's styled as a blocky pixel-art bubble (square corners, a
  stepped two-block tail) to match the sprite instead of a smooth rounded
  chat-bubble look.

## Structure

```
assets/
  mochi-base.svg    canonical sprite, code-generated pixel art, use for the rig
  mochi-pfp.png     TikTok profile picture (pink background, extra margin for the circle crop)
  heart-icon.png    pixel heart used in the bio line
web/
  index.html        live preview + demo controls
  styles.css        sprite layout, prop animations, pixel-art speech bubble
  mochi.js          prop show/hide, Animalese say() function
```

## Using it

Open `web/index.html` in a browser to see Mochi idle, wear a prop, and talk.
From the console (or your own script), the same API used by the demo buttons
is exposed as `window.Mochi`:

```js
Mochi.say("this one is a must-have!");   // types it out with blips
Mochi.showProp("heart");                 // "heart" | "music" | "sweat" | "angry" | "sparkle"
Mochi.clearProps();
```

## Turning this into an actual TikTok video

The page itself isn't a video file. For a real video: build the scene in
`index.html` (swap in the right captions/props for that video), then capture
it frame-by-frame with a headless browser and encode with ffmpeg. That
capture step isn't part of this repo yet since it depends on the specific
video being made — ask Claude to set it up per-video, or say the word and a
small capture script can be added here too.

## Adding a new expression or prop

1. If it's a simple shape (heart, sparkle, sweat drop, a line, a cross), add
   it as an inline SVG in `index.html` under `.prop`, matching the pattern of
   the existing ones, then reference its `data-prop` name from `Mochi.showProp()`.
2. If it needs an actual face change (e.g. a genuinely different mouth/eye
   shape, not just an accessory), that needs a new small SVG overlay
   positioned over the base sprite's face region, cropped tight so it only
   replaces what's changing. None of these exist yet; the current set is
   all prop-based on purpose, to avoid re-fighting the pixel-alignment
   problems from the old painted-illustration rig.

## Brand

- Display name: **Mochi Beauty**
- Handle: **@mochiiibeauty**
- Bio line: "Mochi was created by a tech and beauty girly ❤️" (pixel heart in `assets/heart-icon.png`)
