// Center Detail Page Interactions (Anime.js)
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function entrance() {
    const card = $('.detail-card');
    if (card) {
      card.style.opacity = '0';
      anime({ targets: card, opacity: [0, 1], translateY: [12, 0], duration: 600, easing: 'easeOutQuad' });
    }
  }

  function setupRipples() {
    $$('.btn').forEach((btn) => {
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

  // Keep map large and centered when container size changes
  function ensureMap() {
    if (window.naverDetailMap && window.naver && window.naver.maps) {
      try {
        const center = window.naverDetailMap.getCenter();
        window.naver.maps.Event.trigger(window.naverDetailMap, 'resize');
        window.naverDetailMap.setCenter(center);
      } catch (e) {}
    }
  }

  function observeMap() {
    const mapEl = $('#map');
    if (!mapEl || !('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(() => { ensureMap(); });
    ro.observe(mapEl);
  }

  function init() {
    entrance();
    setupRipples();
    observeMap();
    // initial pass
    setTimeout(ensureMap, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
