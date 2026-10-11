(function () {
  'use strict';
  document.documentElement.classList.add('js-enabled');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progressBar = document.getElementById('progress-bar');
  var year = document.getElementById('year');
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var heroVisual = document.querySelector('.hero-visual');
  var scrollTicking = false;

  if (year) year.textContent = String(new Date().getFullYear());

  function updateScrollProgress() {
    if (!progressBar) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Reveal content when it enters view. If IntersectionObserver is unavailable,
  // leave content visible rather than hiding it behind an unsupported effect.
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach(function (item, index) {
      item.style.setProperty('--delay', Math.min(index % 4, 3) * 70 + 'ms');
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  // Accessible mobile navigation, including Escape and restoring focus.
  function closeMenu(restoreFocus) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(opening));
      menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      mobileMenu.hidden = !opening;
      document.body.classList.toggle('menu-open', opening);
      if (opening) {
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 800) closeMenu(false);
    }, { passive: true });
  }

  // A restrained pointer response on desktop only. Touch devices keep a stable,
  // light UI; no cursor replacement and no pointer-position work on mobile.
  if (heroVisual && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var frame = 0;
    heroVisual.addEventListener('pointermove', function (event) {
      var bounds = heroVisual.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width - 0.5;
      var y = (event.clientY - bounds.top) / bounds.height - 0.5;
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        heroVisual.style.setProperty('--pointer-x', (x * 8).toFixed(2) + 'px');
        heroVisual.style.setProperty('--pointer-y', (y * 8).toFixed(2) + 'px');
      });
    });

    heroVisual.addEventListener('pointerleave', function () {
      if (frame) window.cancelAnimationFrame(frame);
      heroVisual.style.setProperty('--pointer-x', '0px');
      heroVisual.style.setProperty('--pointer-y', '0px');
    });
  }
})();
