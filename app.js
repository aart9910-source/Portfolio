(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.querySelector('.hero-stage');
  var toggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var canvas = document.getElementById('particle-field');
  var context = canvas ? canvas.getContext('2d', { alpha: true }) : null;
  var points = [];
  var width = 0;
  var height = 0;
  var frame = 0;
  var pointer = { x: -1000, y: -1000 };
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function closeMenu(restoreFocus) {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    mobileMenu.hidden = true;
    if (restoreFocus) toggle.focus();
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var opening = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      mobileMenu.hidden = !opening;
      if (opening) {
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu(false);
    }, { passive: true });
  }

  function setPointer(event) {
    if (!stage || !finePointer || reduceMotion) return;
    var bounds = stage.getBoundingClientRect();
    var x = (event.clientX - bounds.left) / bounds.width - 0.5;
    var y = (event.clientY - bounds.top) / bounds.height - 0.5;
    var cx = Math.max(-0.5, Math.min(0.5, x));
    var cy = Math.max(-0.5, Math.min(0.5, y));

    stage.style.setProperty('--orb-x', (cx * 19).toFixed(2) + 'px');
    stage.style.setProperty('--orb-y', (cy * 16).toFixed(2) + 'px');
    stage.style.setProperty('--orbit-one-rotation', (-28 + cx * 4).toFixed(2) + 'deg');
    stage.style.setProperty('--orbit-two-rotation', (53 - cx * 5).toFixed(2) + 'deg');
    stage.style.setProperty('--orbit-three-rotation', (26 + cy * 5).toFixed(2) + 'deg');

    stage.querySelectorAll('.project-panel').forEach(function (panel) {
      var depth = Number(panel.getAttribute('data-depth') || 1);
      panel.style.setProperty('--panel-x', (cx * -11 * depth).toFixed(2) + 'px');
      panel.style.setProperty('--panel-y', (cy * -9 * depth).toFixed(2) + 'px');
      panel.style.setProperty('--tilt-x', (cy * -3.2 * depth).toFixed(2) + 'deg');
      panel.style.setProperty('--tilt-y', (cx * 4.2 * depth).toFixed(2) + 'deg');
    });

    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
  }

  function resetPointer() {
    if (!stage) return;
    stage.style.setProperty('--orb-x', '0px');
    stage.style.setProperty('--orb-y', '0px');
    stage.style.setProperty('--orbit-one-rotation', '-28deg');
    stage.style.setProperty('--orbit-two-rotation', '53deg');
    stage.style.setProperty('--orbit-three-rotation', '26deg');
    stage.querySelectorAll('.project-panel').forEach(function (panel) {
      panel.style.setProperty('--panel-x', '0px');
      panel.style.setProperty('--panel-y', '0px');
      panel.style.setProperty('--tilt-x', '0deg');
      panel.style.setProperty('--tilt-y', '0deg');
    });
    pointer.x = -1000;
    pointer.y = -1000;
  }

  if (stage && finePointer && !reduceMotion) {
    stage.addEventListener('pointermove', setPointer, { passive: true });
    stage.addEventListener('pointerleave', resetPointer, { passive: true });
  }

  if (!canvas || !context || !stage) return;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function resizeCanvas() {
    var rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.max(30, Math.min(66, Math.round(width / 13)));
    points = [];
    for (var i = 0; i < count; i++) {
      points.push({
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.13, 0.13),
        vy: random(-0.14, 0.14),
        radius: random(0.5, 1.5),
        alpha: random(0.2, 0.72)
      });
    }
    drawFrame(false);
  }

  function drawFrame(move) {
    if (!context) return;
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (move && !reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      if (pointer.x > -100 && !reduceMotion) {
        var dx = p.x - pointer.x;
        var dy = p.y - pointer.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 135 && distance > 0.1) {
          var strength = (135 - distance) / 135;
          p.x += (dx / distance) * strength * 0.34;
          p.y += (dy / distance) * strength * 0.34;
        }
      }

      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        var lx = p.x - q.x;
        var ly = p.y - q.y;
        var length = Math.sqrt(lx * lx + ly * ly);
        if (length < 116) {
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(q.x, q.y);
          context.strokeStyle = 'rgba(255,106,35,' + ((1 - length / 116) * 0.17) + ')';
          context.lineWidth = 0.7;
          context.stroke();
        }
      }

      context.beginPath();
      context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(255,151,79,' + p.alpha + ')';
      context.fill();
    }
  }

  function animate() {
    frame = 0;
    if (document.hidden || reduceMotion) return;
    drawFrame(true);
    frame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!reduceMotion && !document.hidden && !frame) frame = window.requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  }

  resizeCanvas();
  window.addEventListener('resize', function () {
    resizeCanvas();
    if (!reduceMotion) startAnimation();
  }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });

  if (!reduceMotion) startAnimation();
})();