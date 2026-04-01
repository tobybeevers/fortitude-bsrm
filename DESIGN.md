# Fortitude — Design Reference

## Brand Positioning
Consultancy-first, founder-led, discreet. The aesthetic is closer to a private bank or luxury concierge than a traditional security company. Every design decision should reinforce: *exclusive, understated, trustworthy*.

---

## Colour Palette

| Token              | Hex / Value                      | Usage                                      |
|--------------------|----------------------------------|--------------------------------------------|
| `--bg-primary`     | `#0c1022`                        | Page background                            |
| `--bg-secondary`   | `#0f1520`                        | Alternate section background               |
| `--bg-surface`     | `#141b2d`                        | Select dropdowns, deep cards               |
| `--bg-card`        | `#111827`                        | Card backgrounds                           |
| `--gold`           | `#c9a84c`                        | Primary accent — links, labels, highlights |
| `--gold-muted`     | `rgba(201, 168, 76, 0.08)`       | Subtle gold fills (panel headers)          |
| `--gold-border`    | `rgba(201, 168, 76, 0.18)`       | Dividers, card borders                     |
| `--gold-border-mid`| `rgba(201, 168, 76, 0.3)`        | Button borders, hover borders              |
| `--text-primary`   | `#ede9df`                        | Headings, strong text — warm off-white     |
| `--text-secondary` | `#8d919e`                        | Body copy                                  |
| `--text-muted`     | `#505568`                        | Captions, meta, subtle labels              |

**Why this palette:** The gold (`#c9a84c`) is slightly warmer and more muted than the initial `#d4af37` — it reads as aged rather than brash, more consistent with the crest in the logo. The off-white text (`#ede9df`) has a slight warm undertone that pairs well with the gold and avoids the sterile feel of pure white on dark backgrounds.

---

## Typography

### Headings — Cormorant Garamond
- Source: Google Fonts (single import, `display=swap` for performance)
- Weights used: 300 (primary), 400 (supporting), italic variants
- Rationale: Used by private banks, luxury fashion houses, high-end print. Elegant, legible at large sizes, distinctive without being decorative.
- `font-weight: 300` italic for hero and section headings
- `font-weight: 400` for service titles and sub-headings

### Body — System Font Stack
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```
- No additional load, crisp on all platforms
- Provides clean contrast with the editorial serif headings

### Hierarchy
| Element     | Font     | Size (desktop) | Weight | Notes                    |
|-------------|----------|----------------|--------|--------------------------|
| h1          | Serif    | ~5.2rem clamp  | 300    | Italic, with gold `em`   |
| h2          | Serif    | ~2.8rem clamp  | 300    |                          |
| h3          | Serif    | 1.5rem         | 400    |                          |
| Eyebrow     | Sans     | 0.68rem        | 600    | All-caps, 0.22em spacing |
| Body        | Sans     | 1rem           | 400    | Line-height 1.9          |
| Small/meta  | Sans     | 0.65–0.78rem   | 400–600|                          |

---

## Spacing & Layout

- Max content width: `1100px`
- Section padding: `7rem 2rem` (desktop), `5rem 1.5rem` (tablet)
- Grid gaps: `5–7rem` for two-column layouts — generous breathing room
- The golden rule: **when in doubt, add more space**

---

## Components

### Buttons
Two variants:
- **`.btn`** — transparent background, gold border. Primary CTA for secondary actions.
- **`.btn-filled`** — gold fill, dark text. Primary CTA for hero and form submission.

Hover states always invert: filled becomes light, outline becomes filled.

### Eyebrow Labels
Small-caps tracking label above section headings. Always gold. Always `0.22em` letter-spacing. Used to label what a section is about without disrupting the heading hierarchy.

### The Rule
A 36px × 1px gold horizontal line (`<div class="rule">`). Used as a visual pause — separates a heading from detailed content, or anchors a closing statement.

### Credentials Panel (About section)
A bordered panel with a header row and stacked credential rows. Each row has a gold label above a description. Deliberately table-like — reads as a formal record, not a marketing list.

### Service Items
Full-width rows with a left column (index number + service label) and right column (title, description, bullet points). Index numbers are deliberately low-opacity — structural, not decorative. Bullet points use an em-dash (`—`) in gold rather than standard list markers.

### Contact Form
Underline-only input style (no boxes). Labels float above in gold small-caps. Textarea is deliberately short — the enquiry should be a conversation starter, not a brief.

---

## Design Principles

1. **Space is luxury.** Cramped layouts signal cheapness. Every section has room to breathe.
2. **No icons.** Icons are generic. Typography and layout carry the hierarchy instead.
3. **No animations.** Transitions on hover only. Nothing moves unless touched.
4. **Copy earns its place.** Every paragraph should have a reason to exist. Cut what doesn't work.
5. **The founder is the brand.** Credentials and biography are the most important content on the site. Design supports them, not the other way around.
6. **Discretion in the design itself.** No bold gradients, no dramatic effects, no visual shouting. The design communicates confidence through restraint.

---

## GitHub Pages → Azure SWA Migration

The `staticwebapp.config.json` is already in place. When migrating:

1. Create an Azure Static Web App resource
2. Connect to the GitHub repository
3. Set build output to `/` (root, no build step)
4. Azure will auto-detect `staticwebapp.config.json`
5. Update `CONTACT_ENDPOINT` in `assets/js/main.js` with the Azure Function URL

Security headers (HSTS, X-Frame-Options, etc.) are pre-configured in `staticwebapp.config.json` and will be applied automatically on Azure SWA.

---

## Contact Form — Azure Communication Services

The form is wired and ready. To activate:

1. Deploy an Azure Function that accepts `POST` with `{ name, email, interest, message }`
2. The function should use the Azure Communication Services Email SDK to forward to `inquiries@fortitudebsrm.com`
3. Set `CONTACT_ENDPOINT` at the top of `assets/js/main.js` to the function URL

Until the endpoint is live, the form simulates success after a short delay (MVP preview mode).
