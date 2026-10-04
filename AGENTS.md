# AGENTS.md

Project name: **`myportfolio`**.

This is a single-page **vanilla HTML/CSS/JS** portfolio. There is no React in it — no JSX, no
components, no bundler, no `package.json`. Do not assume a React toolchain exists, and do not
introduce one unless explicitly asked. If a React migration happens later, this file and the
architecture notes below must be rewritten in the same change, because every coupling note here
describes hand-written HTML and DOM lookups.

No build step: `index.html`, `styles.css`, `script.js`, `profile.png`.

## Commands

There are none. No `package.json`, no lockfile, no CI, no linter, no formatter, no tests,
and no git repo. Do not invent `npm run` commands or add tooling to "fix" the site.

To verify a change, open `index.html` directly in a browser (`file://` works — there are no
`fetch`/module/CORS calls). If a server is needed, any static server from the parent folder
works; it changes nothing about the code.

## Architecture

- Plain HTML/CSS/JS. No framework, no bundler, no npm/CDN dependency. Fully offline-capable.
- `script.js` is a **classic** script tag at the end of `<body>` (not `type="module"`), so its
  top-level `const`s are globals. There is no import/export anywhere.
- All content lives in `index.html` except skills and the hero transcript — see below. Sections
  are plain `<section id>` anchors: `hero`, `about`, `skills`, `experience`, `projects`,
  `contact`.
- Every section below the hero uses the same two-column shell: `.split` > `.split-rail`
  (title + `.rail-note`) beside `.split-body`. Keep new sections on that structure.
- Colors, radius, shadow, and fonts are `:root` custom properties (`styles.css:1-19`). This is a
  dark theme only; there is no light mode or `prefers-color-scheme` block. Single breakpoint at
  `max-width: 768px` — add mobile rules there, not in new media queries scattered elsewhere.
  There is also a single `prefers-reduced-motion` block at the end of the file; add motion there
  rather than scattering `@media` blocks.
- Type is three system stacks, no webfont files: `--font-display` (serif, headlines),
  `--font-sans` (body/UI), `--font-mono` (genuinely technical values only — tech tags, model
  name, dates, project kinds). Do not put mono on decorative labels.
- Icons, where used, are HTML numeric character entities (`&#10003;`), not an icon font or
  library. Keep that convention; do not introduce an icon CDN.
- `.split-rail` is `position: sticky` on desktop and reset to `static` in the mobile block.
- Cards are flat: hairline `--line` borders, no drop shadows. `--shadow` is used only on
  `.transcript`. Do not reintroduce lift-on-hover; hover is a border/background shift.

## Coupling between HTML, CSS, and JS

These break silently or throw if changed independently:

- **`#skillsGrid` is intentionally empty in the HTML.** Skill groups are rendered from the
  `skillGroups` array at the top of `script.js`. Edit that array to change skills; do not paste
  markup into the div. Each group is `{ label, items[] }` and renders as a label plus a row of
  pills.
- **`getElementById` targets must exist** or the script throws and *everything* after the throw
  stops running (nav highlighting, menu, typewriter, footer year all die). Current ids:
  `skillsGrid`, `navbar`, `hamburger`, `transcriptAnswer`, `year`, plus `section[id]` and
  `.nav-links` for scrolling, and `navLinks` for `aria-controls`.
- **The hero typewriter writes into `#transcriptAnswer`.** The reply text is the `transcript`
  object at the top of `script.js`; the question and meta row are static in `index.html`. Keep
  the two in sync. Under `prefers-reduced-motion` the final text is set immediately and the
  caret never renders, so nothing may depend on the typing having run.
- **Nav active-link math derives from navbar height.** `updateActiveLink` computes
  `navbar.offsetHeight + 52`, so changing `--nav-h` needs no JS change. Keep it derived rather
  than hardcoding a number.
- **Anchors rely on `scroll-margin-top`** (`calc(var(--nav-h) + 16px)`) to clear the fixed
  navbar. Without it, clicking a nav link hides the section heading underneath the bar.
- The mobile menu toggles two classes in sync: `hamburger.open` and `.nav-links.open`, both set
  by `setMenu()`. Both are needed for the animation to look right. `.nav-links` is
  `visibility: hidden` when closed so it leaves the tab order — do not replace that with the
  transform alone.
- **There is no scroll-reveal system and no `.reveal` class.** If you add entrance animation,
  it must not gate content on JavaScript; anything hidden by default needs a visible no-JS
  state.

## Before deploy

Currently local-only, no deploy config. Placeholder content still to fill in `index.html`:

- `mailto:your.email@example.com` and the GitHub/LinkedIn `yourusername` URLs + their visible
  `contact-value` text.
- All six project buttons are `href="#"` — no real demo/repo targets.
- Project screenshots: each `.project-thumb` reads `--img: url('img/...')` from an inline
  style and falls back to a hairline pattern when the file is absent. Drop real screenshots in
  an `img/` folder and update the three paths.
- `og:image` points at `og.png`, which does not exist yet. Needs a 1200x630 image at the site
  root, plus a `og:url` once there is a domain.
- Year count is normalised to "2 years" everywhere (title meta, About, timeline, badges).

The surname is spelled **`Hammmad`** with three `m`s, consistently in the title, hero, about,
and footer. Do not "fix" it to `Hammad`.
