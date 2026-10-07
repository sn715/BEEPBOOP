# BEEPBOOP
gx landing page!

Pre-launch landing page for **Beep Boop**, a clip-on concert recorder. Visitors arrive from ads, and the page's job is to answer "my phone already does this" and collect reservation emails. The product brief decides section order, copy and claims; if anything here conflicts with it, the brief wins.

It's plain HTML, CSS and JavaScript, with no build step and no dependencies. Fonts load from Google Fonts.

## Running it

Open `index.html` in a browser.

## Files

| File | What it does |
|---|---|
| `index.html` | The page: every section, in order |
| `css/styles.css` | All styles, written mobile-first |
| `js/config.js` | Values that change: **prices** and **A/B audio sample URLs** |
| `js/main.js` | Behavior: signup forms, prices, A/B record player, ticket tilt, scroll effects, sticky bar, custom cursor, analytics hook |

## Page structure

The order follows the product brief, section 9. The design is art-directed for desktop, and smaller screens get a simpler stacked version.

1. **Hero:** one sentence saying what it is, plus the email signup. The image is shaped like a torn concert ticket stub and tilts gently toward the mouse.
2. **Marquee:** moments from a night out, scrolling in big type.
3. **The tradeoff:** the problem, in big type. The words light up as you scroll.
4. **Full-width venue photo**
5. **The sound:** the A/B player is a record. Press it to play, and pick "on a phone" or "on beep boop" underneath.
6. **The button:** an overlapping collage of an arch-shaped image and a small detail shot.
7. **The card:** no account, no cloud, no subscription. On small screens this section moves up to sit right after the tradeoff, as the brief asks.
8. **The app:** deliberately quieter than the hardware sections.
9. **How it works:** four steps with colored number dots.
10. **The object**
11. **The details:** the spec table, low on the page for the technical crowd.
12. **Questions:** the 12 FAQ questions from the brief.
13. **Reserve:** "first batch, first in line", with the price and the second signup form.
14. **Footer:** a giant "beep boop" bleeding off the bottom.

## Things to know before editing

### Prices live in `js/config.js` only
Any element with `data-price="reservation"` or `data-price="retail"` is filled in from the config. Never type a price into the HTML.

### The A/B audio player
Add the two sample files and set `samples.phone` and `samples.device` in `js/config.js`. The player plays both in sync and switches which one you hear. Until both are set, it shows an honest placeholder message, as the brief requires.

### Unconfirmed facts are marked TBC
`<span class="tbc">tbc</span>` shows up as a soft amber pill. The brief says to never guess specs, so these stay visible until the team confirms each one. To find them all, search the HTML for `class="tbc"`.

### Image placeholders
`.placeholder` boxes describe the shot that belongs there, following the brief's photography direction. To swap one, replace the `<div class="placeholder ...">` with an `<img>` or `<video>`. If the image is a render, keep the "prototype render" caption.

### Styles
- **House style is all lowercase.** Write copy in lowercase. `body` also sets `text-transform: lowercase` as a safety net.
- **Fonts:** Funnel Display for headlines and Funnel Sans for everything else. No serif and no monospace.
- **Look:** inspired by Teenage Engineering, with soft grey grounds, lots of space, rounded shapes, and amber `#C2642B` as the one accent. Dark sections use the brief's faceplate `#22241E`.
- **Design settings:** colors, type sizes, spacing and motion are CSS variables at the top of `css/styles.css`.
- **Layout:** the base styles are the simple stacked layout, and `@media (min-width: 1024px)` builds the desktop compositions.
- **Image shapes:** `.placeholder` modifiers set the shape: `--arch`, `--circle`, `--screen`, `--object`, `--bleed`, plus the `.ticket` in the hero.

### Motion and the custom cursor
The custom cursor (a dot that inverts what's under it and grows over links) only appears on devices with a mouse or trackpad. Over the record it says "play". The ticket tilt, marquee, word lighting, scroll reveals and record spin all respect "reduce motion".

## Tracking (Meta Pixel)
Every event goes through one `track()` function in `js/main.js`:
- Signup form submit → `Lead` (includes which form: `hero` or `reserve`)
- CTA clicks → `ViewContent` (from each element's `data-cta` attribute)
- Playing the A/B sample → `ViewContent`

To turn it on, paste the Meta Pixel base code into `<head>` in `index.html`. Nothing else needs to change.

## Next steps
- [ ] Connect the signup forms to an email service (the TODO in `js/main.js`)
- [ ] Add the Meta Pixel base code
- [ ] Real renders and photos in place of the placeholders (keep the "prototype render" caption for renders)
- [ ] Confirm every TBC (specs, FAQ answers, ship window)
- [ ] Real A/B audio samples
- [ ] Logo and wordmark (currently just "Beep Boop" in text)
