(function () {
  'use strict';

  /* Opening night. Single editable constant — change this date to retarget
     the countdown. Assumed 31 days from launch. */
  var SHOW_DATE = new Date('2026-11-05T19:00:00-08:00').getTime();

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- countdown ---------- */
  var countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    var units = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };
    var caption = countdown.querySelector('[data-countdown-label]');
    var pad = function (value) { return String(value).padStart(2, '0'); };

    var tick = function () {
      var diff = SHOW_DATE - Date.now();
      if (diff <= 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(function (key) {
          if (units[key]) { units[key].textContent = '00'; }
        });
        countdown.classList.add('is-live');
        if (caption) { caption.textContent = 'Opening night is here — welcome to the show.'; }
        return true;
      }
      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;
      if (units.days) { units.days.textContent = String(days); }
      if (units.hours) { units.hours.textContent = pad(hours); }
      if (units.minutes) { units.minutes.textContent = pad(minutes); }
      if (units.seconds) { units.seconds.textContent = pad(seconds); }
      return false;
    };

    if (!tick()) {
      var timer = window.setInterval(function () {
        if (tick()) { window.clearInterval(timer); }
      }, 1000);
    }
  }

  /* ---------- reveal on scroll ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  }
})();
