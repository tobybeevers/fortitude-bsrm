# Bespoke Website Project Plan
## Azure + Google Workspace Stack

## Project Overview
Build and deploy a bespoke HTML/CSS/JavaScript website with functional contact form that sends enquiries via Azure Communications Services to the client's Google Workspace email inbox.

---

## 1. Domain Registration

### Provider: Fasthost
**Cost:** ~£10/year

**Steps:**
1. Go to fasthost.co.uk
2. Search for desired domain
3. Add to cart and checkout
4. Complete purchase

**What You Get:**
- Domain ownership for 1 year
- Access to DNS management
- Auto-renewal available (recommended)

**Notes:**
- Renewal: Set auto-renewal to avoid losing the domain
- DNS: You'll configure this later to point to Azure and verify email services
- Keep Fasthost DNS editor open—you'll need it multiple times

---

## 2. Website Hosting

### Provider: Azure Static Web Apps (SWA)
**Cost:** Free tier (sufficient for this project), scales to ~£50/month if needed

**Why Azure SWA:**
- Free tier for hosting
- Git-based deployments (push code, auto-deploys)
- HTTPS included
- Integrated with your existing Azure infrastructure
- Serverless functions included

**Setup Steps:**

### 2.1 Prepare Your Code Structure

Your GitHub repo should look like:

```
project/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
├── api/
│   ├── contact.js
│   └── package.json
├── staticwebapp.config.json
└── README.md
```

> **Note:** The site (index.html, assets/) is already built and deployed. The `api/` folder is the only addition needed for the contact form backend.

**staticwebapp.config.json:**
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "index.html",
    "exclude": ["/api/*", "*.{css,gif,ico,jpg,js,png,svg,webp,woff,woff2}"]
  }
}
```

**api/package.json** (inside the `api/` folder only — not repo root):
```json
{
  "name": "contact-form",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'No build step needed'",
    "start": "echo 'Static site'"
  },
  "dependencies": {
    "@azure/communication-email": "^1.0.0"
  }
}
```

### 2.2 Create Azure Static Web App

1. **In Azure Portal:**
   - Search for "Static Web Apps"
   - Click "Create"
   - Fill in details:
     - **Name:** (your project name)
     - **Region:** UK South (close to client)
     - **Source:** GitHub
     - **GitHub Account:** (authorize and select your repo)
     - **Organization:** (select yours)
     - **Repository:** (select your project repo)
     - **Branch:** master
     - **Build Presets:** Custom
     - **Build Location:** (leave blank for static)
     - **Output Location:** (leave blank for root)
     - **API Location:** api

2. **Click Create**
   - Azure will create a GitHub Actions workflow
   - Deployment happens automatically on push to main

3. **Configure Custom Domain**
   - Once deployed, in SWA resource: Custom domains
   - Add your Fasthost domain
   - Azure provides DNS details
   - Update DNS at Fasthost (see Section 4)

---

## 3. Email Service Setup

### Part A: Client's Business Email (Google Workspace)

**Provider:** Google Workspace Business Starter
**Cost:** £4.80/month (client pays)

**Steps:**

1. **Client purchases Google Workspace**
   - Go to workspace.google.com
   - Sign up with their business details
   - Select Business Starter plan
   - Follow setup wizard

2. **Domain Verification**
   - Google provides TXT record for domain verification
   - Client adds this to Fasthost DNS
   - Wait 24-48 hours for verification

3. **MX Records Configuration**
   - Google provides MX records
   - Client adds these to Fasthost DNS
   - Email now routes to Google

4. **Result:**
   - Client gets: Gmail inbox, Drive, Calendar
   - Email address: name@theirdomain.com
   - They own and manage the inbox

---

### Part B: Form Email Sending (Azure Communications Services)

**Provider:** Azure Communication Services
**Cost:** Free tier (250 emails/month), ~£0.50 per 1,000 after

**Why Azure Communications:**
- Integrated with your Azure infrastructure
- Free tier sufficient for enquiry forms
- Simple API integration
- No separate vendor account to manage

**Setup Steps:**

#### Step 1: Create Communication Service Resource

1. **In Azure Portal:**
   - Search for "Communication Services"
   - Click "Create"
   - Fill in:
     - **Resource Group:** (create new or use existing)
     - **Resource Name:** (e.g., "contact-form-email")
     - **Data Location:** United Kingdom
   - Click "Review + Create" then "Create"

2. **Wait for deployment** (2-3 minutes)

#### Step 2: Verify Sender Domain

1. **In Communication Services resource:**
   - Left menu: Domains under Email
   - Click "Set up sender domain"
   - Choose "Custom domain"
   - Enter domain: theirdomain.com

2. **Azure provides DNS records:**
   - You'll see TXT and CNAME records
   - Copy these exactly

3. **Add DNS records at Fasthost:**
   - Log into Fasthost DNS manager
   - Add the TXT record Azure provides
   - Add the CNAME record Azure provides
   - Save and wait 24-48 hours for propagation

4. **Verify in Azure:**
   - Once DNS propagates, click "Verify" in Azure
   - Status should change to "Verified"

#### Step 3: Get Connection String

1. **In Communication Services resource:**
   - Settings → Keys (or Connection Strings)
   - Copy the connection string
   - Store securely (you'll add to Azure Functions)

#### Step 4: Create Azure Function for Form Handling

**Option A: Using Azure Portal (Easy)**

1. **Create Function App:**
   - In Azure Portal: "Function App" → Create
   - Fill in:
     - **Name:** contact-form-function
     - **Runtime:** Node.js 18
     - **Region:** UK South
   - Create

2. **Create HTTP Trigger Function:**
   - In Function App: Functions → Create
   - Select: HTTP trigger
   - Name it: contact
   - Authorization level: Function

3. **Replace function code** (see code below)

4. **Add Application Settings:**
   - In Function App: Configuration
   - Add:
     - `COMMUNICATION_SERVICES_CONNECTION_STRING` = (your connection string)
     - `CLIENT_EMAIL` = client@theirdomain.com
     - `SENDER_EMAIL` = noreply@theirdomain.com
   - Save

**Function Code (Node.js):**

```javascript
const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
  // Only accept POST
  if (req.method !== "POST") {
    return {
      status: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const { name, email, interest, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return {
      status: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  try {
    const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
    const client = new EmailClient(connectionString);

    const emailMessage = {
      senderAddress: process.env.SENDER_EMAIL,
      recipients: {
        to: [{ address: process.env.CLIENT_EMAIL }],
      },
      replyToAddress: email,
      subject: `New enquiry from ${name}`,
      bodyPlainText: `
Name: ${name}
Email: ${email}
Area of Interest: ${interest || 'Not specified'}

Message:
${message}
      `,
      bodyHtml: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Area of Interest:</strong> ${interest || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    const poller = await client.beginSendMail(emailMessage);
    const result = await poller.pollUntilDone();

    context.log("Email sent successfully");

    return {
      status: 200,
      body: JSON.stringify({ success: true, message: "Email sent" }),
    };
  } catch (error) {
    context.log("Error sending email:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
```

#### Step 5: Get Function URL

1. **In Function App:**
   - Functions → contact function
   - Get Function URL (copy the URL with code parameter)
   - This is what your form will POST to

---

## 4. Contact Form & Frontend Integration

> **Note:** The site (index.html, assets/css/style.css, assets/js/main.js) is already built. The form is wired and ready — `main.js` already handles the POST to `CONTACT_ENDPOINT`. To activate, set `CONTACT_ENDPOINT` in `assets/js/main.js` to the Azure Function URL. The HTML/JS/CSS samples below are reference only and do not need to be applied.

### 4.1 HTML Form (reference only — site already built)

The existing form in `index.html` submits `{ name, email, interest, message }`. The reference structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main>
    <section id="contact">
      <h1>Get in Touch</h1>
      <form id="enquiry-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label for="message">Message:</label>
          <textarea id="message" name="message" required rows="5"></textarea>
        </div>
        
        <button type="submit" id="submit-btn">Send Enquiry</button>
        <p id="form-status"></p>
      </form>
    </section>
  </main>

  <script src="js/form-handler.js"></script>
</body>
</html>
```

### 4.2 Form Handler JavaScript

Create `js/form-handler.js`:

```javascript
document.getElementById('enquiry-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  };

  const button = document.getElementById('submit-btn');
  const statusEl = document.getElementById('form-status');
  
  button.disabled = true;
  button.textContent = 'Sending...';
  statusEl.textContent = '';

  try {
    // Replace with your Azure Function URL
    const functionUrl = 'https://YOUR-FUNCTION-APP.azurewebsites.net/api/contact?code=YOUR_CODE';

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      statusEl.textContent = 'Message sent successfully!';
      statusEl.style.color = 'green';
      e.target.reset();
    } else {
      statusEl.textContent = 'Error: ' + (data.error || 'Failed to send');
      statusEl.style.color = 'red';
    }
  } catch (error) {
    statusEl.textContent = 'Failed to send message. Please try again.';
    statusEl.style.color = 'red';
    console.error(error);
  } finally {
    button.disabled = false;
    button.textContent = 'Send Enquiry';
  }
});
```

### 4.3 Basic CSS

Create `css/style.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

main {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

#contact {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 2px rgba(0,120,212,0.2);
}

button {
  background: #0078d4;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #005a9e;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

#form-status {
  margin-top: 15px;
  font-size: 14px;
}
```

---

## 5. DNS Configuration Summary

You'll need to add/update DNS records at Fasthost for:

1. **Static Web App (Azure)**
   - CNAME record from Azure SWA
   - Points: yourdomain.com → Azure SWA endpoint

2. **Email Sending (Azure Communications)**
   - TXT record for domain verification
   - CNAME record for email routing
   - Provided by Azure Communications during setup

3. **Client Email (Google Workspace)**
   - MX records for Google Workspace
   - TXT record for domain verification
   - Provided by Google Workspace

**Order of operations:**
1. Add SWA CNAME record (deploy website first)
2. Add Azure Communications records (verify sender domain)
3. Add Google Workspace records (client sets up email)

---

## Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| **Domain (Fasthost)** | £10/year | One-time annual renewal |
| **Hosting (Azure SWA)** | Free-£50/month | Free tier sufficient, scales as needed |
| **Email Sending (Azure Comms)** | Free (250/month) | Free tier; upgrade if exceeds limit |
| **Client Email (Google Workspace)** | £4.80/month | Client pays this |
| **Azure Function** | Included in free tier | Part of Azure subscription |
| **Your Total Cost** | ~£10/year | Upgrade SWA/Comms if client scales |
| **Client Cost** | ~£58/year | Just Google Workspace |

---

## Deployment Checklist

### Phase 1: Infrastructure Setup
- [ ] Domain purchased at Fasthost
- [x] GitHub repo created — tobybeevers/fortitude-bsrm
- [x] `staticwebapp.config.json` added to repo (security headers pre-configured)
- [x] Site built and live on GitHub Pages (staging)
- [ ] `api/package.json` created (when building Function)
- [ ] Azure Static Web App created in Portal
- [ ] SWA connected to GitHub repo (master branch)
- [ ] SWA deployment triggered (push to master)
- [ ] SWA custom domain configured
- [ ] SWA CNAME record added to Fasthost DNS
- [ ] Wait 24-48 hours for DNS propagation

### Phase 2: Email Infrastructure
- [ ] Azure Communication Services resource created
- [ ] Custom domain added to Comms Service
- [ ] Azure provides DNS records for verification
- [ ] TXT and CNAME records added to Fasthost
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Domain verified in Azure Communications
- [ ] Connection string copied from Comms Service
- [ ] Azure Function App created
- [ ] HTTP trigger function created
- [ ] Function code deployed
- [ ] Environment variables added to Function App
- [ ] Function URL copied

### Phase 3: Frontend Integration
- [x] HTML form built with correct structure (name, email, interest, message)
- [x] Form handler JavaScript in `assets/js/main.js` — POSTs to `CONTACT_ENDPOINT`
- [x] CSS styling complete
- [ ] Set `CONTACT_ENDPOINT` in `assets/js/main.js` to Azure Function URL
- [ ] Push to GitHub (master branch)
- [ ] SWA redeploys automatically
- [ ] Test form on live site end-to-end

### Phase 4: Client Email Setup
- [ ] Client purchases Google Workspace
- [ ] Google provides domain verification TXT record
- [ ] Client adds TXT record to Fasthost
- [ ] Domain verified in Google
- [ ] Google provides MX records
- [ ] Client adds MX records to Fasthost
- [ ] Wait 24-48 hours for email routing
- [ ] Client can now receive emails at name@theirdomain.com

### Phase 5: End-to-End Testing
- [ ] Fill out form on live website
- [ ] Check client's Google Workspace inbox for email
- [ ] Email arrives within 1 minute
- [ ] Reply field shows correct sender
- [ ] HTML formatting displays correctly
- [ ] Submit button disables during send
- [ ] Success message displays to user
- [ ] Test with multiple submissions (within 250/month limit)

### Phase 6: Go Live
- [ ] All DNS records propagated
- [ ] Email delivery verified
- [ ] Form tested end-to-end
- [ ] Client trained on Google Workspace
- [ ] Client given Fasthost DNS access (optional)
- [ ] Handover documentation provided
- [ ] Site goes live

---

## Post-Launch Maintenance

### What You Maintain
- Website code (bug fixes, updates, features)
- Azure infrastructure (monitoring, scaling)
- Azure Function code and environment variables
- Form submission handling
- Domain renewal at Fasthost (set auto-renewal)

### What the Client Maintains
- Google Workspace email account
- Checking their email inbox
- Paying for Google Workspace
- Backing up emails (Google does this for them)

### Support & Monitoring
- Monitor Azure Function logs for errors
- Check email delivery success in Azure Comms dashboard
- Monitor SWA deployment logs for build failures
- Keep Azure Comms free tier limit in mind (250/month)
- Alert client if approaching limit

---

## Troubleshooting

### Form submissions not arriving
1. Check Azure Function logs (Monitor → Logs)
2. Verify Azure Comms domain is "Verified" status
3. Check environment variables are correct
4. Verify client email address is correct
5. Check browser console for fetch errors
6. Confirm Function URL is correct in form handler

### "Failed to send email" error
1. Check Azure Communications quota hasn't exceeded 250/month
2. Verify sender email is verified in Azure Comms
3. Check connection string in Function App settings
4. Review Azure Function error logs

### Domain not resolving
1. Wait 24-48 hours for DNS propagation
2. Check CNAME record matches exactly (Azure provides)
3. Use online DNS checker to verify
4. Verify at Fasthost DNS editor that records are saved

### Email not routing to Google
1. Verify MX records are added at Fasthost
2. Wait 24-48 hours for propagation
3. Check Google Workspace domain verification is complete
4. Test with external email first (send to theirdomain.com)

### Azure Communications free tier limit reached
1. Upgrade to paid tier in Azure Portal
2. Pricing: ~£0.50 per 1,000 emails after free tier
3. Or wait until next month (limit resets)

---

## Key Differences from Original Plan

| Original | This Plan |
|----------|-----------|
| Render hosting | Azure SWA |
| SendGrid email | Azure Communications Services |
| Namecheap domain | Fasthost domain |
| Independent services | Azure-integrated stack |

**Advantages of this stack:**
- Single vendor (Azure) reduces operational overhead
- Everything integrated within your existing Azure subscription
- Cheaper overall (free tier sufficient)
- You maintain control over the entire stack

---

## Summary

**Timeline:** 4-6 hours initial setup (mainly DNS waiting), 15 minutes per deployment after

**Services Used:** Fasthost (domain), Azure (hosting + email), Google (client email)

**Scalability:** Free tier handles thousands of enquiries. Upgrade components as needed.

**Support:** You maintain Azure infrastructure, client maintains their Google email.

**DNS Warning:** You'll touch Fasthost DNS 3+ times. Keep detailed notes of what was added when.
