(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progressBar = document.getElementById('progress-bar');
  var year = new Date().getFullYear();
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var scrollPending = false;

  function updateProgress() {
    if (progressBar) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var progress = total > 0 ? window.scrollY / total : 0;
      progressBar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, progress)) + ')';
    }
    scrollPending = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollPending) {
      window.requestAnimationFrame(updateProgress);
      scrollPending = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

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
        var first = mobileMenu.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 920) closeMenu(false);
    }, { passive: true });
  }

  var revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-enabled');
    var observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 3) * 45 + 'ms';
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }
})();