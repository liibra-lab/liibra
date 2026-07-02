# Liibra visual identity

Liibra's identity is typography-first and library-like: ink on paper, one
working blue, and a brass accent drawn from the scales in the mark. It should
feel like a trustworthy public reading room, not a startup.

## Logo

The logo is a pair of balance scales built from the double *ii* of "Liibra" —
the letterforms become the pillars, the beam swings beneath them, and the
pivot dot doubles as the tittle of an *i*.

| Asset | File | Use |
| --- | --- | --- |
| Mark | `src/lib/assets/liibra-mark.svg` | Header, favicons, small spaces |
| Mark (white) | `src/lib/assets/liibra-mark-white.svg` | Dark backgrounds |
| Wordmark | `src/lib/assets/liibra-wordmark.svg` | Print, partners, wide spaces |
| Wordmark (white) | `src/lib/assets/liibra-wordmark-white.svg` | Dark backgrounds |
| Vertical lockup | `src/lib/assets/liibra-logo.svg` | Covers, social cards, splash |
| Vertical lockup (white) | `src/lib/assets/liibra-logo-white.svg` | Dark backgrounds |
| Favicon | `src/lib/assets/liibra-favicon.svg` | Browser tabs (auto light/dark) |

### Wordmark construction

The wordmark is **Fraunces** at optical size 144, weight 600, `SOFT 0`,
`WONK 0`, converted to outlines — it does not depend on the webfont being
loaded. The round tittles of the double *ii* deliberately echo the pivot dot
of the mark. If the name ever needs to be re-set (e.g. a new lockup), use the
same instance so the letterforms stay consistent.

### Usage rules

- Ink (`#1a1a1b`) on light backgrounds; white on dark. No other fills,
  gradients, or outlines.
- Clearspace: keep at least the height of the wordmark's *L* stem free on all
  sides of any lockup.
- Don't set "Liibra" in another typeface next to the mark, and don't stretch,
  rotate, or recolor the assets.
- Minimum sizes: mark 16 px tall; wordmark 80 px wide; vertical lockup 96 px
  tall. Below that, use the mark alone.

## Typography

| Role | Face | Token |
| --- | --- | --- |
| Wordmark, headings, document titles | Fraunces (variable, self-hosted) | `--font-serif` / `font-serif` |
| Body, UI chrome, metadata | System sans stack | `--font-sans` / `font-sans` |

**Fraunces** (SIL OFL, `src/lib/assets/fonts/OFL.txt`) is self-hosted as a
latin-subset variable woff2 (`src/lib/assets/fonts/fraunces-latin-var.woff2`,
weights 300–900) — no third-party font CDN at runtime. The latin subset
covers all Portuguese diacritics. Georgia is the fallback while it loads
(`font-display: swap`), so text renders immediately.

- Headings use `font-optical-sizing: auto`: large headings get the
  high-contrast display cut, small ones a sturdier text cut, automatically.
- Brand-name text (header, footer) is weight 600 to match the wordmark.
- Legal source text is content, not brand — it stays in the readable body
  stack.

## Color

Defined as Tailwind v4 `@theme` tokens in `src/routes/layout.css`; Tailwind
generates the utilities (`text-liibra-ink`, `border-liibra-rule`, …).

| Token | Hex | Role |
| --- | --- | --- |
| `liibra-ink` | `#1a1a1b` | Text, logo fill |
| `liibra-muted` | `#5a5a5a` | Secondary text, metadata |
| `liibra-bg` | `#ffffff` | Page background |
| `liibra-surface` | `#f7f6f3` | Warm paper — footer, panels, cards |
| `liibra-rule` | `#e2e2e2` | Hairline borders and dividers |
| `liibra-link` | `#1a5fb4` | Links, focus rings |
| `liibra-link-visited` | `#6a3fa0` | Visited links |
| `liibra-accent` | `#8a6d1f` | Brass — the header's top rule; small decorative moments only |

Rules of thumb:

- Blue is functional (it means "clickable"), never decorative. Don't use it
  for headings or emphasis.
- Brass is decorative, never functional — a rule, a marker, a detail. Use it
  sparingly (one moment per view) and don't set body text in it.
- Ink on `liibra-bg`/`liibra-surface` and `liibra-link` on white both meet
  WCAG AA for normal text.

## Voice cues for visuals

- Prefer whitespace and hierarchy over boxes and shadows.
- Hairline rules (`liibra-rule`) separate content; surfaces (`liibra-surface`)
  group it.
- Official source links stay visibly links — attribution is part of the
  identity.
