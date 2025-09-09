// Center Main Page Animations (Anime.js only)
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function entrance() {
    const header = document.querySelector('h1');
    const sections = $$('.area-section');
    const cards = $$('.center-card');

    if (header) {
      anime({ targets: header, translateY: [-10, 0], duration: 600, easing: 'easeOutQuad' });
    }

    if (sections.length) {
      anime({
        targets: sections,
        translateY: [12, 0],
        duration: 550,
        delay: anime.stagger(100, { start: 120 }),
        easing: 'easeOutQuad'
      });
    }

    if (cards.length) {
      anime({
        targets: cards,
        translateY: [8, 0],
        duration: 500,
        delay: anime.stagger(30, { start: 300 }),
        easing: 'easeOutQuad'
      });
    }
  }

  function setupCardHover() {
    $$('.center-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        anime.remove(card);
        anime({ targets: card, translateY: -4, duration: 160, easing: 'easeOutQuad' });
      });
      card.addEventListener('mouseleave', () => {
        anime.remove(card);
        anime({ targets: card, translateY: 0, duration: 160, easing: 'easeOutQuad' });
      });
    });
  }

  function setupButtonRipples() {
    $$('.view-detail-btn, .area-cta-btn').forEach((btn) => {
      // ensure relative positioning for ripple
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.35)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'scale(0)';
        btn.appendChild(ripple);

        anime({ targets: ripple, scale: [0, 1], opacity: [0.45, 0], duration: 520, easing: 'easeOutQuad', complete: () => ripple.remove() });
      });
    });
  }

  function init() {
    entrance();
    setupCardHover();
    setupButtonRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
