# Fortitude — Deployment Guide

---

## Current Hosting: GitHub Pages

**Repo:** https://github.com/tobybeevers/fortitude-bsrm
**Live URL:** https://tobybeevers.github.io/fortitude-bsrm/
**Branch:** `master` (root, no build step)

### Push to Live

```bash
git add assets/css/style.css assets/js/main.js index.html
git commit -m "your message"
git push origin master
```

Pages deploys within ~60 seconds of push. No CI/CD configuration required.

### Custom Domain (when ready)

1. In the repo → Settings → Pages → Custom domain → enter `www.fortitudebsrm.com`
2. Add a CNAME record at your DNS registrar:
   ```
   CNAME  www  tobybeevers.github.io
   ```
3. Enable "Enforce HTTPS" once DNS propagates

---

## Target Hosting: Azure Static Web Apps

`staticwebapp.config.json` is pre-configured in the repo root. Security headers (HSTS, X-Frame-Options, CSP, Referrer-Policy) are already set.

### Migration Steps

1. Create an **Azure Static Web App** resource in the Azure Portal
2. Connect it to the `tobybeevers/fortitude-bsrm` GitHub repo
3. Set the build configuration:
   - **App location:** `/`
   - **Output location:** `/`
   - **Build command:** *(leave blank — no build step)*
4. Azure will auto-detect `staticwebapp.config.json` and apply routing rules and headers
5. Update the custom domain in Azure SWA settings and update DNS (CNAME → the SWA-provided URL)
6. Disable GitHub Pages once Azure SWA is confirmed live

### Activate Contact Form

Once the Azure Function is deployed:

1. Open `assets/js/main.js`
2. Update line 42:
   ```js
   const CONTACT_ENDPOINT = 'https://your-function-app.azurewebsites.net/api/ContactForm';
   ```
3. Commit and push — form is immediately live

#### Azure Function Requirements

The function should accept `POST` with JSON body:
```json
{
  "name": "string",
  "email": "string",
  "interest": "string",
  "message": "string"
}
```

Forward to `inquiries@fortitudebsrm.com` using the **Azure Communication Services Email SDK**.

Return `200 OK` on success, any non-2xx on failure (the form will show an error with the direct email address as fallback).

---

## Environment Summary

| Stage       | Host            | URL                                          | Contact Form |
|-------------|-----------------|----------------------------------------------|--------------|
| Development | Local file      | `file:///…/index.html`                       | MVP mode     |
| Staging     | GitHub Pages    | https://tobybeevers.github.io/fortitude-bsrm/| MVP mode     |
| Production  | Azure SWA       | https://www.fortitudebsrm.com                | Live (once endpoint set) |

---

## Git Workflow

```bash
# Check what's changed
git status
git diff

# Stage specific files (preferred over git add -A)
git add index.html assets/css/style.css assets/js/main.js

# Commit
git commit -m "brief description of change"

# Push to GitHub Pages
git push origin master
```

Remote is HTTPS (SSH keys not configured on this machine):
```
https://github.com/tobybeevers/fortitude-bsrm.git
```
