/* ============================================================
   VIP Hair — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- HEADER SCROLL SHADOW ---------- */
  const header = document.getElementById('top') ? document.querySelector('.site-header') : document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- SCROLL FADE IN (IntersectionObserver) ---------- */
  const fadeItems = document.querySelectorAll('.fade-in-item');
  if ('IntersectionObserver' in window && fadeItems.length) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeItems.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    fadeItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- COUNT-UP ANIMATION ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var isDecimal = el.getAttribute('data-decimal') === 'true';
    var duration = 1400;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(ease * target);
      if (isDecimal) {
        // 48 -> show as 4.8
        el.textContent = (current / 10).toFixed(1);
      } else {
        el.textContent = current;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var statNums = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && statNums.length) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  /* ---------- OPEN / CLOSED STATUS ---------- */
  (function updateOpenStatus() {
    var pulse = document.getElementById('open-pulse');
    var statusText = document.getElementById('open-status-text');
    if (!pulse || !statusText) return;

    // Opening hours (verified):
    // Mon–Fri: 10:00–18:00, Sat: 10:00–16:00, Sun: Closed
    var now = new Date();
    var day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    var hour = now.getHours();
    var minute = now.getMinutes();
    var timeVal = hour * 60 + minute; // minutes since midnight

    var open = false;
    var opensAt = null;
    var closesAt = null;

    if (day >= 1 && day <= 5) {
      // Mon–Fri 10:00–18:00
      opensAt = 10 * 60;
      closesAt = 18 * 60;
    } else if (day === 6) {
      // Saturday 10:00–16:00
      opensAt = 10 * 60;
      closesAt = 16 * 60;
    }
    // Sunday: closed (no open hours)

    if (opensAt !== null && timeVal >= opensAt && timeVal < closesAt) {
      open = true;
    }

    if (open) {
      pulse.classList.add('is-open');
      pulse.classList.remove('is-closed');
      var remaining = closesAt - timeVal;
      var remHours = Math.floor(remaining / 60);
      var remMins = remaining % 60;
      var closingStr = remHours > 0
        ? 'Stänger om ' + remHours + ' tim ' + (remMins > 0 ? remMins + ' min' : '')
        : 'Stänger om ' + remMins + ' min';
      statusText.textContent = 'Öppet nu · ' + closingStr.trim();
    } else {
      pulse.classList.add('is-closed');
      pulse.classList.remove('is-open');
      if (day === 0) {
        statusText.textContent = 'Stängt idag (Söndag)';
      } else if (opensAt !== null && timeVal < opensAt) {
        statusText.textContent = 'Öppnar kl 10:00';
      } else {
        // After closing
        var nextDay = day === 5 ? 'Lördag kl 10:00' : (day === 6 ? 'Måndag kl 10:00' : 'Imorgon kl 10:00');
        statusText.textContent = 'Stängt · Öppnar ' + nextDay;
      }
    }
  })();

  /* ---------- FLIP CARD TOUCH TOGGLE ---------- */
  var flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(function (card) {
    // Touch/click toggle on mobile
    card.addEventListener('click', function () {
      // Only toggle class on devices that have no hover (touch)
      if (window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('flipped');
      }
    });

    // Keyboard accessibility
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

})();