// Center Update Page Interactions (Anime.js)
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function entrance() {
    const card = $('.upd-card') || $('.container');
    if (!card) return;
    card.style.opacity = '0';
    anime({ targets: card, opacity: [0, 1], translateY: [10, 0], duration: 500, easing: 'easeOutQuad' });
  }

  function setupRipples() {
    $$('.btn, .search-btn, .btn-update, .btn-delete, .btn-cancel').forEach((btn) => {
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);

        anime({ targets: ripple, scale: [0, 1], opacity: [0.45, 0], duration: 520, easing: 'easeOutQuad', complete: () => ripple.remove() });
      });
    });
  }

  function init() {
    entrance();
    setupRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
