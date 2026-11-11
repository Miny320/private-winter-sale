// Neve Atelier, Private Winter Sale: small enhancements, no libraries.
(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.hero');
  const access = document.getElementById('access');

  // Header: show a thin line once the page scrolls.
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Countdown to the end of the private sale.
  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const end = Date.parse(countdown.dataset.end || '');
    const units = {};
    for (const el of countdown.querySelectorAll('[data-unit]')) units[el.dataset.unit] = el;
    const pad = (value) => String(value).padStart(2, '0');
    let timer = 0;

    const tick = () => {
      const left = end - Date.now();
      if (!Number.isFinite(left) || left <= 0) {
        window.clearInterval(timer);
        countdown.querySelector('.countdown__units')?.setAttribute('hidden', '');
        countdown.querySelector('.countdown__label')?.setAttribute('hidden', '');
        countdown.querySelector('.countdown__ended')?.removeAttribute('hidden');
        return;
      }
      const seconds = Math.floor(left / 1000);
      units.days.textContent = pad(Math.floor(seconds / 86400));
      units.hours.textContent = pad(Math.floor((seconds % 86400) / 3600));
      units.minutes.textContent = pad(Math.floor((seconds % 3600) / 60));
      units.seconds.textContent = pad(seconds % 60);
    };

    tick();
    timer = window.setInterval(tick, 1000);
  }

  // Fade sections in as they enter the screen.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    for (const item of revealItems) observer.observe(item);
  } else {
    for (const item of revealItems) item.classList.add('is-visible');
  }

  // Access form: check the fields, then show a thank-you message.
  const form = document.querySelector('[data-access-form]');
  const success = document.querySelector('[data-form-success]');
  if (form && success) {
    const email = form.elements.namedItem('email');
    const consent = form.elements.namedItem('consent');
    const error = form.querySelector('[data-form-error]');

    const validate = () => {
      if (email.validity.valueMissing) return { field: email, message: 'Please enter your email address.' };
      if (!email.validity.valid) return { field: email, message: 'Please enter a valid email address, like name@example.com.' };
      if (!consent.checked) return { field: consent, message: 'Please tick the box, so we can email your code.' };
      return null;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      email.value = email.value.trim();
      const problem = validate();
      email.setAttribute('aria-invalid', String(problem?.field === email));
      error.textContent = problem ? problem.message : '';
      if (problem) {
        problem.field.focus();
        return;
      }

      // This demo has no back end. A real shop would send the email to its
      // newsletter or customer platform here, then show the same message.
      success.querySelector('[data-success-email]').textContent = email.value;
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    form.addEventListener('input', () => {
      if (!error.textContent) return;
      if (!validate()) {
        error.textContent = '';
        email.removeAttribute('aria-invalid');
      }
    });
  }

  // Mobile: a small sticky bar after the hero, hidden again near the form.
  const bar = document.querySelector('[data-mobile-cta]');
  if (bar && hero && access && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let accessVisible = false;
    const update = () => {
      const show = !heroVisible && !accessVisible;
      bar.classList.toggle('is-shown', show);
      bar.inert = !show;
    };

    bar.hidden = false;
    update();
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      update();
    }).observe(hero);
    new IntersectionObserver(([entry]) => {
      accessVisible = entry.isIntersecting;
      update();
    }).observe(access);
  }
})();
