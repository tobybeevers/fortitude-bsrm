# Fortitude Bespoke Solutions & Risk Management — Website

Static marketing site for Fortitude BSRM, a Dubai-based bespoke security consultancy targeting royal households, HNWI, family offices, and corporate executives.

**Live site:** https://tobybeevers.github.io/fortitude-bsrm/
**Production domain:** www.fortitudebsrm.com
**Contact:** inquiries@fortitudebsrm.com

---

## Project Structure

```
/
├── index.html                  # Single-page site
├── assets/
│   ├── css/
│   │   └── style.css           # Full design system — CSS custom properties
│   ├── js/
│   │   └── main.js             # Splash, mobile nav, contact form, smooth scroll
│   └── img/
│       ├── Logo.png            # Primary logo
│       ├── favicon.svg         # SVG favicon
│       ├── Welcome Page.mp4    # Splash video (autoplay, muted)
│       ├── Welcome Page.png    # Splash fallback image
│       ├── SIA.png             # SIA Licensed badge
│       └── SIRA.png            # SIRA Approved badge
├── staticwebapp.config.json    # Azure SWA routing + security headers (pre-wired)
├── BRAND.md                    # Brand guidelines
├── CONTENT.md                  # Section-by-section content inventory
├── DESIGN.md                   # Design system reference
├── DEPLOYMENT.md               # Deployment and migration guide
├── founder-bio.md              # Client source: founder biography
├── fortitude-overview.md       # Client source: business overview
└── fortitude-intro-page.md     # Client source: intro page copy
```

---

## Local Development

No build process. Open `index.html` directly in a browser:

```
open index.html
```

Or serve locally to avoid asset path issues:

```bash
npx serve .
# or
python -m http.server 8080
```

---

## Technology

| Concern       | Approach                                         |
|---------------|--------------------------------------------------|
| Markup        | Semantic HTML5, single `index.html`              |
| Styles        | Vanilla CSS, CSS custom properties design tokens |
| Scripts       | Vanilla JS, no frameworks or dependencies        |
| Fonts         | Cormorant Garamond (Google Fonts), system sans   |
| Hosting       | GitHub Pages (current), Azure SWA (target)       |
| Contact form  | Azure Communication Services via Azure Function  |

---

## Page Sections

1. **Splash** — MP4 video autoplay, fades out on `ended` event (10s fallback)
2. **Navigation** — Fixed, scroll-state aware, hamburger menu on mobile
3. **Hero** — Headline, credentials summary, CTAs, logo watermark
4. **About** — Founder bio, credentials panel with SIRA/SIA logos
5. **Services** — 7 numbered service items (01–07)
6. **Approach** — Three-step methodology
7. **Contact** — Enquiry form (name, email, interest, message)
8. **Footer** — Logo, cert badges, nav links, tagline

---

## Contact Form

The form is fully wired. To activate:

1. Deploy an Azure Function accepting `POST { name, email, interest, message }`
2. Set `CONTACT_ENDPOINT` at the top of `assets/js/main.js` to the function URL

Until the endpoint is set, the form runs in **MVP preview mode** — simulates success after a short delay.

See `DESIGN.md` for full Azure Communication Services integration notes.

---

## Deployment

See `DEPLOYMENT.md` for step-by-step GitHub Pages and Azure SWA instructions.

**Quick push to live:**
```bash
git add -A
git commit -m "your message"
git push origin master
```

GitHub Pages serves from `master` branch root. Changes are live within ~60 seconds.
