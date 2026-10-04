# UI Audit — Muhammad Hammmad Portfolio

Scope: `index.html`, `styles.css`, `script.js` as they currently stand.
Nature: design review. Nothing in this document is a functional bug report except where
explicitly filed under **P0**.

---

## 1. Verdict

The engineering is clean. Every coupling documented in `AGENTS.md` is honoured, the script has
no dead references, the CSS is consistently organised, and the file opens correctly over
`file://`. There is no reason to restructure any of it.

The design, however, is a template. It lands on two of the most widely reproduced
machine-generated looks:

1. **Tinted near-black with a single bright teal accent.** `--bg: #0b1220` is a blue-shifted
   near-black, `--accent: #14b8a6` is stock teal. This is the default "AI developer portfolio"
   palette.
2. **The centered portrait hero.** Circular photo, gradient ring, glow, eyebrow, name, job
   title, paragraph, two pill buttons.

Add a third, structural habit: five consecutive sections using an identical
eyebrow → centered title → centered content shape.

None of this is broken. It is the absence of choice, and it is why the page reads as assembled
rather than designed.

### What is genuinely worth keeping

- The **timeline with a gradient rule that fades into the border colour**
  (`styles.css:403-411`). This is a real structural device, not decoration. Preserve it.
- The **pill system** (`.badge` at `styles.css:352`, `.project-tags span` at
  `styles.css:520`). Consistent, restrained, and it scales. Preserve it.
- The single-breakpoint discipline at `styles.css:613`. Adding rules in one place is correct
  and should continue.
- The `container` / `section-title` / `section` vocabulary. Keep the names; change the
  behaviour of the title block.

---

## 2. Findings by priority

### P0 — Correctness and accessibility defects

These are not taste. Each one degrades the page for a real group of visitors.

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | **No `:focus-visible` styling anywhere in the document.** Every link, button and card is keyboard-reachable but shows only the UA default outline, which is near-invisible against `--card: #16213a`. | `styles.css` (absent) | See §4.1 |
| 2 | **Mobile menu is focusable while closed.** `.nav-links` is moved off-screen with `transform: translateX(100%)` but is never `visibility: hidden`. Tab order walks into links the user cannot see. | `styles.css:618-635` | See §4.2 |
| 3 | **No `prefers-reduced-motion` block.** `scroll-behavior: smooth` (`styles.css:23`), the infinite `bounce` loop (`styles.css:295`), and the 0.7s reveal transitions (`styles.css:599`) all run unconditionally. The bounce never stops. | `styles.css` (absent) | See §4.3 |
| 4 | **Hamburger has no `aria-expanded` / `aria-controls`, and no Escape handler.** | `index.html:23`, `script.js:59-62` | See §4.4 |
| 5 | **`word-break: break-all` on `.contact-value`.** Splits `linkedin.com/in/yourusername` mid-word at arbitrary characters. | `styles.css:583` | `overflow-wrap: anywhere` |
| 6 | **GitHub icon is a floppy disk** (`&#128190;`). LinkedIn's is a generic silhouette bust (`&#128100;`). Both are misleading next to their labels. | `index.html:200`, `index.html:207` | Replace, or drop the icon and let the label carry it |
| 7 | **`backdrop-filter` without `-webkit-` prefix.** Older Safari drops the blur and the navbar becomes a flat translucent bar. | `styles.css:56` | See §4.5 |
| 8 | **Hero glow is clipped by the navbar.** `.hero-glow` sits at `top: -180px`; the fixed navbar occupies the first 68px, so the brightest part of the gradient is hidden behind it. | `styles.css:161` vs `styles.css:72` | Reposition, or accept it as a redesign decision |

### P1 — Missing foundations

- **No favicon.** The tab shows a default glyph. Cheap, and it reads as unfinished.
- **No `<meta name="theme-color">`.** The browser chrome renders white against a near-black
  page on mobile.
- **No Open Graph tags.** This is the highest-leverage "UI" work that is not even visible on
  the page: it determines how the link renders when pasted into Slack, LinkedIn, X, or an
  email client. Currently a shared portfolio link shows as bare text.
- **No `<meta name="author">`, no canonical URL.**
- **`.project-thumb` carries no information.** Three 160px two-stop gradients with the literal
  word "Project" centred in each (`styles.css:474-496`, `index.html:131-180`). Real screenshots
  would improve this page more than any amount of restyling. The `thumb-1/2/3` classes and the
  `background-size: cover` declaration are set up for images that were never added.

### P2 — Design-generic issues

**2.1 Typography is a non-choice.**
`styles.css:13` — `"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial,
sans-serif`. This is "whatever the operating system provides," not a decision. Segoe UI at
`4.2rem` renders as Windows interface chrome. Type carries more personality per byte than any
other design decision, and right now it carries none.

The sizes are also arbitrary rather than a scale: `clamp(1.9rem, 4vw, 2.6rem)` for section
titles, `clamp(2.6rem, 7vw, 4.2rem)` for the hero name, `clamp(1.1rem, 3vw, 1.6rem)` for the
hero title. There are no steps, no ratio, and no shared vertical rhythm.

**2.2 The hero is the default, and it is the wrong hero for this subject.**
`styles.css:177-194` — 150px circular photo, 5px gradient padding ring, 40px teal glow, then
eyebrow → name → title → paragraph → two pills. It is the most-copied hero in generated
portfolios, and it spends the first screen on the one asset every portfolio has.

More importantly it wastes the subject matter. This person builds chatbots. The most
characteristic thing in that world is a conversation with a model. See §5.

**2.3 Structure is decorative rather than informational.**
`styles.css:308-323` — the eyebrow/title block repeats five times unchanged. The labels
("Get to know me", "What I work with", "My journey", "Things I've built", "Let's talk") are
filler; they would mean nothing reordered or deleted. A structural element should encode
something about the content, not announce it.

**2.4 The skills grid flattens a real distinction.**
`script.js:2-15` lists twelve items spanning four genuinely different categories:

- languages — JavaScript, TypeScript, Python
- frontend — React, Next.js
- backend & AI — Node.js, OpenAI GPT, LangChain, Dialogflow, REST APIs
- tooling & data — SQL / Databases, Git & GitHub

`styles.css:363-367` renders them as twelve identical ~150px cards on `auto-fit`, which resolves
to two flat rows of six. Every skill receives identical visual weight. Grouping them by
category would carry information the flat grid destroys.

**2.5 Motion is four systems doing the same gesture.**
- Hero entrance `fadeUp` on load — `styles.css:174`, `607-610`
- `.reveal` fade-and-slide-up on every section, card and title — `styles.css:596-605`
- `translateY(-6px)` hover lift on `.skill-card`, `.project-card`, `.contact-card` — three
  separate rules
- Infinite `bounce` on the scroll indicator — `styles.css:295-301`

Repeated identically, none of these register as motion. `AGENTS.md` also notes the cost of the
reveal system: the observer's element list at `script.js:73` is hardcoded, so any new element
given `class="reveal"` without being added there stays permanently invisible. A design that
requires a registry to stay visible is a design that should be reconsidered on its own merits,
not just on taste.

**2.6 Layout is 100% centered, single-column, everywhere.**
`width: min(1080px, 90%)` with `text-align: center` on every heading and intro. Nothing uses
the width, nothing is asymmetric, and the result reads as unconsidered rather than calm.
Centered body text is never correct at length — the About card runs to roughly 716px of text
column, about 85 characters, over the 80-character guideline.

**2.7 One radius, one shadow, applied to everything.**
`--radius: 14px` and `--shadow: 0 10px 30px rgba(0,0,0,0.35)` (`styles.css:11-12`) are applied
uniformly to `.about-card`, `.skill-card`, `.timeline-card`, `.project-card`,
`.contact-card`. Flat hierarchy: the eye is given no signal about what matters.

**2.8 The gradient text is doing nothing.**
`styles.css:209` — `linear-gradient(135deg, #ffffff, #a5f3e8)` clipped to text. The two stops
are close enough in luminance that the effect is nearly invisible, and it costs a
`-webkit-text-fill-color` hack. Either make it read or drop it.

**2.9 The tagline is an inventory, not a position.**
`index.html:39` — "Full Stack Developer & Generative AI Specialist focused on building
intelligent chatbots, AI-powered applications, and clean, scalable software with React,
Node.js, Python, and OpenAI." It lists eight technologies and states no claim. A recruiter
skims this. It should say what he does and who it is for, in one line.

---

## 3. Contrast audit

Measured, not estimated. All pairs clear WCAG AA (4.5:1) for normal text with margin.

| Foreground | Background | Ratio | Verdict |
|-----------|-----------|-------|---------|
| `--text-dim` `#9aa8c9` | `--card` `#16213a` | **6.7:1** | Pass AA |
| `--text-dim` `#9aa8c9` | `--bg` `#0b1220` | **7.9:1** | Pass AA |
| `--accent-soft` `#1dd4bf` | `--card` `#16213a` | **8.5:1** | Pass AA |
| `--accent` `#14b8a6` | `--bg` `#0b1220` | **7.5:1** | Pass AA |

**Conclusion: do not spend effort here.** Colour accessibility is not a problem. The problem is
that the palette is generic, which is a completely different issue and is not fixable by
adjusting these values. Any palette change should be re-measured, but the current numbers are
sound and should be preserved as a constraint.

The one genuine colour risk in a redesign is the hero gradient text at `styles.css:209`, where
the effective rendered colour depends on where the gradient happens to land.

---

## 4. Concrete fixes for P0

Drop-in replacements. All are plain CSS/JS, consistent with the no-tooling constraint.

### 4.1 Visible focus for keyboard users

```css
:focus-visible {
  outline: 2px solid var(--accent-soft);
  outline-offset: 3px;
  border-radius: 4px;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent-soft);
  outline-offset: 3px;
}
```

Never remove the outline without replacing it. `.nav-links a::after` (`styles.css:98`) is
`position: absolute`, so the offset ring is safe.

### 4.2 Remove the closed menu from the tab order

The transform alone does not hide content from keyboard users.

```css
@media (max-width: 768px) {
  .nav-links {
    visibility: hidden;
    transition: transform 0.3s ease, visibility 0.3s ease;
  }

  .nav-links.open {
    visibility: visible;
  }
}
```

Pair this with the Escape handler in §4.4.

### 4.3 Respect reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

The explicit `.reveal` override matters. The `!important` transition reset alone will fire the
`IntersectionObserver` instantly, but pinning `.reveal` visible removes any dependency on
JavaScript for the no-motion case.

### 4.4 Menu state and Escape

`index.html:23`:

```html
<button class="hamburger" id="hamburger" aria-label="Toggle menu"
        aria-expanded="false" aria-controls="navLinks">
```

`index.html:16` — add `id="navLinks"` to the `<ul>`.

`script.js`, after the existing click handler:

```js
function setMenu(open) {
  hamburger.classList.toggle("open", open);
  mobileLinks.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
}

hamburger.addEventListener("click", () =>
  setMenu(!hamburger.classList.contains("open"))
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && hamburger.classList.contains("open")) {
    setMenu(false);
    hamburger.focus();
  }
});
```

Note this replaces the class-toggle pair at `script.js:59-62` rather than sitting beside it.
Both `hamburger.open` and `.nav-links.open` are still required — `AGENTS.md` flags this
coupling and it is preserved.

### 4.5 Prefixed backdrop filter

```css
.navbar {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

### 4.6 Word breaking

`styles.css:583` — replace `word-break: break-all;` with `overflow-wrap: anywhere;`.

---

## 5. The one thing worth spending boldness on

Everything else in this document is maintenance. This is the single change that would make the
page unmistakeable.

**Replace the hero portrait-and-glow with a working chat exchange.** An actual question the
chatbot handles, and its actual reply, rendered as a conversation. A model name and token count
in the corner. A cursor on the final line. Typed once on load, once, and then left alone.

This states the specialization faster than any headline can, and it is the only element on the
page that could not be pasted onto someone else's portfolio.

```
┌──────────────────────────────────────────────────────────────┐
│ MH.        About   Skills   Work   Projects   Contact        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  gpt-4o · 312 tokens · 1.4s                     [ OPEN TO WORK ]│
│  ┌────────────────────────────────────────────────────┐      │
│  │ › What stack for a RAG support bot?                 │      │
│  │                                                      │      │
│  │ LangChain with pgvector on Postgres, OpenAI for     │      │
│  │ embeddings, and a thin Node service in front.       │      │
│  │ Cache the FAQ answers before you call the model.█   │      │
│  └────────────────────────────────────────────────────┘      │
│                                                              │
│  I build chatbots that actually answer.                       │
│  Two years shipping them for e-commerce, healthcare and        │
│  FinTech teams.                                               │
│                                                              │
│  [ See the work ]   [ Email me ]                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Left-aligned, not centered. The reply must be *true* — something he actually built and can talk
about in an interview. Fabricated technical claims in a portfolio are a worse problem than a
generic layout.

Constraints:

- Vanilla JS, roughly 25 lines. No library. `AGENTS.md` requires offline capability.
- Under `prefers-reduced-motion: reduce`, render the final state immediately with no typing.
- Delete `.hero-glow`, `.scroll-down`, and the `bounce` keyframes. That removes three
  decorative elements and one infinite animation loop.
- The reply text lives in one constant at the top of `script.js`, beside the `skills` array at
  `script.js:2`, so it is edited the same way as everything else.

---

## 6. Proposed design plan

### 6.1 Colour — hold it quiet

Colour is the least interesting axis on this page, and the current palette is not the reason
the design feels generic. Type and structure are. Recommendation: go near-monochrome, with one
restrained accent reserved for state and emphasis. This is a deliberate rejection of adding
colour, and it dodges every default palette at once.

| Token | Value | Role |
|-------|-------|------|
| `--surface` | `#121214` | Page. Un-tinted neutral, not blue-black. |
| `--raised` | `#1A1A1D` | Cards and panels |
| `--line` | `#2A2A2E` | Hairlines. Replaces borders-as-decoration. |
| `--ink` | `#ECECEE` | Primary text |
| `--ink-dim` | `#9C9CA3` | Secondary text (currently 6.7:1 — re-measure) |
| `--accent` | `#5B8CFF` | One accent. Active nav, focus ring, live reply cursor |

A cooler blue rather than teal, mainly to break the association between teal and "AI
portfolio." It is a marginal gain on its own and is not doing the heavy lifting.

**Rejected alternative:** a light, cool paper surface (`#E8EAED`) with deep ink and a cobalt
accent. This is the bolder move and a stronger differentiator, but it fights recruiter
expectation for developer portfolios. Worth raising with the client before committing.

### 6.2 Type — a deliberate two-family system

All system fonts. No webfont files, no CDN, fully offline. The constraint in `AGENTS.md` is
real and webfonts would break it; personality has to come from pairing and setting, not
downloads.

| Role | Stack | Setting notes |
|------|-------|---------------|
| Display | `'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif` | Headlines at `line-height: 1.05`, letter-spacing tightened to `-0.02em` at large sizes. This is the primary personality move. |
| Body / UI | system sans (current `--font` stack, kept) | `line-height: 1.65`. Body measure capped at **68ch**, not 80. |
| Data | `Cascadia Code, Consolas, ui-monospace, monospace` | Reserved for values that are genuinely technical: tech tags, the model name, dates. |

A serif display against a sans body is a real distinction, and it is the opposite direction
from the current all-sans page. It also avoids landing on the machine-common "monospace label"
default, which is why mono here is confined to actual data instead of small-caps eyebrows.

Set an actual scale with steps, rather than three independent clamps:

```
display   4.2rem / 1.05 / -0.02em
h2        2.6rem / 1.15 / -0.01em
h3        1.2rem / 1.3
body      1.0rem  / 1.65
small     0.875rem / 1.5
micro     0.75rem  / 1.4
```

### 6.3 Layout — editorial split, and a left rail that means something

Kill the centered-everything plan. Section headings move into a narrow left column; body
content sits in a wider right column. Headings left-aligned, body left-aligned, measure
capped at 68ch. The hero becomes full-bleed.

The left rail replaces the deleted eyebrows. It carries the section's actual name and a
one-line descriptor that means something — not a tracking-out all-caps label, and explicitly
**not** a `01 / 02 / 03` number, which would be decoration pretending to encode a sequence.

```
┌───────────────────────────────────────────────────────────────┐
│  SKILLS          │  LANGUAGES                                 │
│  what I build    │  TypeScript · Python · JavaScript          │
│  with            │                                            │
│                  │  FRONTEND                                  │
│                  │  React · Next.js                           │
│                  │                                            │
│                  │  AI & BACKEND                              │
│                  │  OpenAI · LangChain · Dialogflow · Node.js  │
│                  │                                            │
│                  │  TOOLING                                   │
│                  │  Postgres · Git · REST                     │
└───────────────────────────────────────────────────────────────┘
```

This resolves finding 2.4 as a side effect: four labelled groups replace twelve anonymous
tiles, and the visual structure now tells the reader something true about the content.

### 6.4 Motion — one orchestrated moment

| Keep | Cut |
|------|-----|
| Hero chat typing, once, on load | `.reveal` on every section, card and title |
| Nav underline on hover / active | `translateY(-6px)` on all three card types |
| Button press feedback | `.scroll-down` and the `bounce` loop |
| Menu slide | Hero `fadeUp` (redundant with the hero entrance) |

Cutting `.reveal` also removes the hardcoded observer list at `script.js:73` and the
silent-invisibility failure mode documented in `AGENTS.md`. Hover on cards becomes a border
and background shift only — no lift.

### 6.5 Principles

- One memorable element. Everything else is disciplined.
- Structure encodes meaning or it is removed.
- No motion that no human asked for.
- Content over decoration, in both the visual sense and the copy.

---

## 7. Prioritised actions

**Phase 1 — defects. Roughly 30 minutes, no design risk.**
`§4.1` focus rings · `§4.2` menu tab order · `§4.3` reduced motion · `§4.4` aria and Escape ·
`§4.5` prefix · `§4.6` word-break · favicon · `theme-color` · OG tags · GitHub and LinkedIn
icons.

Do this regardless of any decision about the redesign.

**Phase 2 — content. Before any visual work.**
Real project screenshots in `.project-thumb` (`index.html:131-180`) · the six placeholder
`href="#"` buttons get real targets (`index.html:142-178`) · real email, GitHub and LinkedIn
(`index.html:194-208`) · rewrite the tagline per §2.9 · resolve the `2+ years` vs `2 years`
inconsistency between the meta description and the About copy.

Screenshots alone will do more for this page than any restyling in this document.

**Phase 3 — hero.** §5. Delete `.hero-glow`, `.scroll-down`, `bounce`.

**Phase 4 — type and layout.** §6.2 and §6.3, plus the skills regrouping.

**Phase 5 — motion and palette pass.** §6.4, then §6.1 if the neutral direction is agreed.

---

## 8. Constraints any change must respect

From `AGENTS.md`. These break silently and are the easiest things to violate while redesigning.

- **`#skillsGrid` is intentionally empty** in the HTML (`index.html:90`). Skill cards are
  rendered from the `skills` array at `script.js:2`. Do not paste markup into the div.
- **Every `getElementById` target must exist**, or the script throws and *all* subsequent
  behaviour dies. Current ids: `navbar`, `hamburger`, `skillsGrid`, `year`.
- **`.reveal` starts at `opacity: 0`** (`styles.css:596`) and depends on the hardcoded
  observer list at `script.js:73`. There is no no-JS fallback. (Phase 1 removes this
  dependency; until then, any new `.reveal` element must be added to that selector list.)
- **Nav active-link math is coupled to navbar height.** `updateActiveLink` hardcodes
  `section.offsetTop - 120` (`script.js:44`) against a navbar of `height: 68px`
  (`styles.css:72`). Change one, change the other.
- **The mobile menu toggles two classes in sync** — `hamburger.open` and `.nav-links.open`
  (`script.js:59`). Both are required for the animation to read correctly.
- **Single breakpoint.** Mobile rules go in the existing `max-width: 768px` block at
  `styles.css:613`, not in new scattered media queries.
- **Icons are HTML numeric character entities**, not an icon font. Keep that convention; do
  not introduce an icon CDN.
- **No framework, no bundler, no npm, no build step.** `script.js` is a classic script tag,
  so its top-level `const`s are globals.
- **Surname is `Hammmad`,** three `m`s, consistently. Do not "correct" it.
- **Verification is opening `index.html` in a browser.** `file://` works; there are no
  `fetch`, module or CORS calls.

---

## 9. File map for the changes above

| File | Sections touched | Phases |
|------|------------------|--------|
| `index.html` | `6` (meta, OG, favicon) · `23, 16` (aria) · `34, 39` (hero, tagline) · `74-79` (badges) · `90` (skills) · `131-180` (screenshots) · `142-178` (links) · `194-208` (contact) · `200, 207` (icons) | 1, 2, 3, 4 |
| `styles.css` | `1-14` (tokens) · `13` (type) · `56` (prefix) · `72` (navbar height) · `161` (glow) · `177-194` (hero) · `276-301` (scroll cue) · `308-323` (section titles) · `363-367` (skills grid) · `474-496` (thumbs) · `583` (word-break) · `596-605` (reveal) · `613+` (mobile) | 1, 3, 4, 5 |
| `script.js` | `2-15` (skills data) · `44` (nav offset) · `56-70` (menu) · `73` (reveal list) · new: chat transcript constant + typewriter | 1, 3, 4 |
