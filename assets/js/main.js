/* ═══════════════════════════════════════════════════════════
   FORTITUDE — main.js
   Contact form handler + navigation
   ═══════════════════════════════════════════════════════════ */

/* ─── SPLASH SCREEN ──────────────────────────────────────────
   Holds for 2s with a slow zoom, then fades out.
   Body scroll is locked until the splash is gone.
   ─────────────────────────────────────────────────────────── */
(function initSplash() {
  const splash = document.getElementById('splash');
  const video  = document.getElementById('splash-video');
  if (!splash) return;

  document.body.classList.add('splash-active');

  function dismiss() {
    splash.classList.add('hiding');
    splash.addEventListener('animationend', function () {
      splash.style.display = 'none';
      document.body.classList.remove('splash-active');
    }, { once: true });
  }

  if (video) {
    /* Fade out when video finishes */
    video.addEventListener('ended', dismiss, { once: true });
    /* Fallback: if autoplay is blocked or video stalls, dismiss after 10s */
    var fallback = setTimeout(dismiss, 10000);
    video.addEventListener('ended', function () { clearTimeout(fallback); }, { once: true });
  } else {
    /* No video — fall back to 2s hold */
    setTimeout(dismiss, 2000);
  }
})();

/* ─── CONTACT FORM ───────────────────────────────────────────
   Backend: Azure Communication Services via Azure Function
   TODO: Replace CONTACT_ENDPOINT with your Azure Function URL
   before going live. Leave empty for MVP/staging preview.
   ─────────────────────────────────────────────────────────── */
const CONTACT_ENDPOINT = '';

(function initContactForm() {
  const form        = document.getElementById('contact-form');
  const formWrapper = document.getElementById('form-wrapper');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('form-submit');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const payload = {
      name:     form.querySelector('#name').value.trim(),
      email:    form.querySelector('#email').value.trim(),
      interest: form.querySelector('#interest').value,
      message:  form.querySelector('#message').value.trim(),
    };

    if (CONTACT_ENDPOINT) {
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Server error');
        showSuccess();
      } catch {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
        alert(
          'There was a problem sending your enquiry.\n' +
          'Please contact us directly at inquiries@fortitudebsrm.com'
        );
      }
    } else {
      /* MVP mode — no endpoint yet. Simulate success for client preview. */
      setTimeout(showSuccess, 700);
    }
  });

  function showSuccess() {
    if (formWrapper) formWrapper.style.display = 'none';
    if (formSuccess) {
      formSuccess.classList.add('visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
})();

/* ─── MOBILE NAV ─────────────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('splash-active', isOpen);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('splash-active');
    });
  });
})();

/* ─── SMOOTH SCROLL (accounts for fixed nav) ────────────── */
(function initSmoothScroll() {
  const nav = document.querySelector('.nav');

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── NAV SCROLL STATE ───────────────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
