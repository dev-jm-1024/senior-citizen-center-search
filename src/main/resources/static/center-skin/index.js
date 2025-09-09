// Minimal interactions using vanilla JS + Anime.js only
// - Keeps existing HTML intact
// - Adds subtle entrance and button ripple + animations
// - No Vue / GSAP usage

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function entrance() {
    const header = $('.header-section');
    const mapCard = $('.map-container');
    const buttons = $$('.action-button');

    if (header) {
      anime({ targets: header, translateY: [-12, 0], duration: 600, easing: 'easeOutQuad' });
    }
    if (mapCard) {
      anime({ targets: mapCard, translateY: [12, 0], duration: 600, delay: 80, easing: 'easeOutQuad' });
    }
    // Buttons: translate only (no opacity) to avoid flicker
    if (buttons.length) {
      anime({ targets: buttons, translateY: [8, 0], duration: 450, delay: anime.stagger(60, { start: 140 }), easing: 'easeOutQuad' });
    }
  }

  function setupButtonRipples() {
    $$('.action-button').forEach((btn) => {
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

  // Hover emphasis only (no idle loop)
  function setupButtonHover() {
    $$('.action-button').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        anime.remove(btn);
        anime({ targets: btn, translateY: -5, scale: 1.04, duration: 200, easing: 'easeOutQuad' });
      });
      btn.addEventListener('mouseleave', () => {
        anime.remove(btn);
        anime({ targets: btn, translateY: 0, scale: 1, duration: 200, easing: 'easeOutQuad' });
      });
    });
  }

  function ensureMapVisibility() {
    const mapEl = $('#map');
    if (!mapEl) return;
    const h = parseInt(getComputedStyle(mapEl).height, 10) || 0;
    if (h < 50) { mapEl.style.minHeight = '460px'; }
    if (window.naverMap && window.naver && window.naver.maps) {
      try {
        const center = window.naverMap.getCenter();
        window.naver.maps.Event.trigger(window.naverMap, 'resize');
        window.naverMap.setCenter(center);
      } catch (e) {}
    }
  }

  function observeMapContainer() {
    const mapEl = $('#map');
    if (!mapEl || !('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(() => { ensureMapVisibility(); });
    ro.observe(mapEl);
  }

  function init() {
    // Force visible baseline
    const container = $('.button-container');
    if (container) { container.style.opacity = '1'; container.style.visibility = 'visible'; }
    $$('.action-button').forEach(b => { b.style.opacity = '1'; b.style.visibility = 'visible'; });

    entrance();
    setupButtonRipples();
    setupButtonHover();
    ensureMapVisibility();
    observeMapContainer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();