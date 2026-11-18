(function () {
  var root = document.documentElement;
  var sw = document.querySelector('.theme-switch');
  if (!sw) return;

  var toggle = sw.querySelector('.theme-switch__toggle');
  var menu = sw.querySelector('.theme-switch__menu');
  var options = sw.querySelectorAll('.theme-switch__option');
  if (!toggle || !menu || !options.length) return;

  var labels = { auto: 'Авто', light: 'Светлая', dark: 'Тёмная' };

  function getTheme() {
    try {
      var t = localStorage.getItem('theme');
      if (t === 'light' || t === 'dark' || t === 'auto') return t;
    } catch (e) {}
    return 'auto';
  }

  function closeMenu() {
    sw.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    sw.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function apply(theme) {
    if (theme !== 'light' && theme !== 'dark') theme = 'auto';
    root.setAttribute('data-theme', theme);
    sw.setAttribute('data-current', theme);
    toggle.setAttribute('aria-label', 'Тема: ' + (labels[theme] || 'Авто'));
    options.forEach(function (btn) {
      var active = btn.getAttribute('data-theme-value') === theme;
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  apply(getTheme());

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (sw.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  options.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var theme = btn.getAttribute('data-theme-value') || 'auto';
      try {
        localStorage.setItem('theme', theme);
      } catch (e2) {}
      apply(theme);
      closeMenu();
      toggle.focus();
    });
  });

  document.addEventListener('click', function (e) {
    if (!sw.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (sw.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    }
  });
})();
