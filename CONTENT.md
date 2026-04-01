# Fortitude — Content Inventory

Section-by-section record of what is live on the site, what is placeholder, and what needs updating before go-live.

---

## Splash Screen

**Type:** MP4 video autoplay
**File:** `assets/img/Welcome Page.mp4`
**Behaviour:** Plays once on page load, fades out on `ended` event. 10-second fallback if autoplay is blocked.
**Status:** Live — approved by client.

---

## Navigation

| Item              | Target    | Status  |
|-------------------|-----------|---------|
| About             | `#about`  | Live    |
| Services          | `#services` | Live  |
| Approach          | `#approach` | Live  |
| Private Enquiry   | `#contact` | Live   |

Mobile: hamburger menu collapses to full-screen overlay.

---

## Hero Section

**Headline:**
> Security and discretion for those who accept
> *no compromise.*

**Sub-copy:**
> A founder-led consultancy delivering intelligence-driven protection and risk management to royal households, family offices, and those who operate at the highest levels.

**Credentials strip:**
- 13+ Years Licensed Experience
- Royal Household Protection
- SIRA Certified — Dubai

**CTAs:**
- "Private Enquiry" → `#contact`
- "Our Services" → `#services`

**Watermark:** Logo at ~opacity 0.12, large, positioned right-of-centre behind heading text.

**Status:** Live — content and positioning approved by client.

---

## About Section

### Founder Bio

> Over 13 years of licensed close protection experience under the UK SIA framework, including long-term responsibility for the protection of a senior member of the Saudi Royal Family.
>
> An operational background within British Special Forces environments informs a methodology built on intelligence-led planning, threat anticipation, and absolute discretion.
>
> Fortitude is founder-led. Every client engagement is personally overseen — there are no handoffs, no junior teams.

**Status:** Live.

### Credentials Panel

| Row | Title                         | Description                                                        | Logo        | Status |
|-----|-------------------------------|--------------------------------------------------------------------|-------------|--------|
| 1   | SIRA Security Manager         | Certified by the Security Industry Regulatory Agency. Full UAE compliance. | SIRA.png (rotated -90°) | Live |
| 2   | SIA Close Protection Licence  | 13+ years licensed under the UK Security Industry Authority framework. | SIA.png | Live |
| 3   | Royal Household Protection    | Long-term appointment as lead protection officer for a senior member of the Saudi Royal Family. | — | Live |
| 4   | British Special Forces        | Operational background within British Special Forces environments. | — | Live |
| 5   | International Travel Security | Extensive experience across complex, multi-jurisdiction travel security operations. | — | Live |

---

## Services Section

Seven numbered service items:

| No. | Label                          | Title                                         |
|-----|--------------------------------|-----------------------------------------------|
| 01  | Close Protection               | Close Protection Strategy & Oversight         |
| 02  | Residential & Lifestyle        | Residential Security & Lifestyle Risk         |
| 03  | Travel Security                | International Travel Risk Management          |
| 04  | Threat Analysis                | Threat, Vulnerability & Exposure Analysis     |
| 05  | Corporate Advisory             | Corporate & Executive Security Advisory       |
| 06  | K&R Consultation               | Kidnap & Ransom Consultation                  |
| 07  | Surveillance & TSCM            | Surveillance, Counter-Surveillance & TSCM     |

**Status:** Live. K&R added per client request.

---

## Approach Section

Three-step methodology:

| Step | Title              | Copy                                                                                      |
|------|--------------------|-------------------------------------------------------------------------------------------|
| 01   | Assessment         | A thorough analysis of your threat environment, lifestyle, and existing security posture.  |
| 02   | Strategy           | A bespoke security strategy built around your specific profile, not an off-the-shelf plan. |
| 03   | Implementation     | Discreet, precise delivery — with direct founder involvement at every stage.               |

**Status:** Live.

---

## Contact Section

**Heading:** Private Enquiry

**Form fields:**
- Full Name (required)
- Email Address (required)
- Area of Interest (select: Close Protection / Residential Security / Travel Security / Threat Analysis / Corporate Advisory / K&R Consultation / TSCM / Other)
- Message (textarea)

**Submit button:** "Submit Enquiry"

**Success message:** "Thank you. We will be in touch shortly."

**Backend status:** MVP preview mode — form simulates success. Azure Function endpoint not yet set.
**To activate:** Set `CONTACT_ENDPOINT` in `assets/js/main.js`.

**Contact details displayed:**
- Email: inquiries@fortitudebsrm.com
- Location: Dubai, United Arab Emirates
- Availability: By appointment — worldwide

---

## Footer

**Logo:** `Logo.png`
**Certification badges:** SIA.png, SIRA.png (circular crop, SIRA rotated -90°)
**Nav links:** About, Services, Approach, Enquiry
**Tagline:** Discretion · Intelligence · Precision
**Copyright:** © 2025 Fortitude Bespoke Solutions & Risk Management

---

## Pre-Go-Live Checklist

- [ ] Activate contact form: set `CONTACT_ENDPOINT` in `assets/js/main.js`
- [ ] Confirm `inquiries@fortitudebsrm.com` mailbox is live and monitored
- [ ] Point custom domain `www.fortitudebsrm.com` to hosting
- [ ] Test contact form submission end-to-end
- [ ] Test on mobile (iOS Safari, Chrome Android)
- [ ] Confirm MP4 splash autoplay on mobile (iOS requires `muted playsinline`)
- [ ] Add Open Graph image (`og:image`) for social sharing previews
- [ ] Review all placeholder email addresses

---

## Source Documents

Client-provided reference files in repo root:

| File                     | Contents                                   |
|--------------------------|--------------------------------------------|
| `founder-bio.md`         | Founder personal biography                 |
| `fortitude-overview.md`  | Business overview and service summary      |
| `fortitude-intro-page.md`| Detailed service descriptions and copy     |
