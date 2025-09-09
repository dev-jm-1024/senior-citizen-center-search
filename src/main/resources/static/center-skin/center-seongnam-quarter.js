// Seongnam Quarter Page Animations & Theming (Anime.js)
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Infer theme from section title text (수정구/분당구/중원구)
  function applyTheme() {
    const wrap = $('.centers-section');
    const title = $('.section-title');
    if (!wrap || !title) return;
    const text = title.textContent || '';
    wrap.classList.remove('theme-red', 'theme-blue', 'theme-orange');
    if (text.includes('수정구')) wrap.classList.add('theme-red');
    else if (text.includes('분당구')) wrap.classList.add('theme-blue');
    else if (text.includes('중원구')) wrap.classList.add('theme-orange');
  }

  // Stabilize layout to avoid irregular arrangement until styles are applied
  function stabilizeLayout() {
    const grid = $('.center-grid');
    if (!grid) return;
    // Force a reflow after fonts/styles load
    requestAnimationFrame(() => {
      grid.style.visibility = 'hidden';
      requestAnimationFrame(() => {
        // tick an empty anime to ensure style application batch is flushed
        anime({duration: 0});
        grid.getBoundingClientRect();
        grid.style.visibility = 'visible';
      });
    });

    // Observe for size changes and retrigger visibility to settle layout
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        grid.getBoundingClientRect();
      });
      ro.observe(grid);
    }
  }

  function entrance() {
    const header = $('header');
    const section = $('.centers-section');
    const cards = $$('.center-card');

    if (header) {
      anime({ targets: header, translateY: [-10, 0], duration: 600, easing: 'easeOutQuad' });
    }
    if (section) {
      anime({ targets: section, translateY: [10, 0], duration: 550, delay: 120, easing: 'easeOutQuad' });
    }
    if (cards.length) {
      anime({ targets: cards, translateY: [8, 0], duration: 500, delay: anime.stagger(30, { start: 220 }), easing: 'easeOutQuad' });
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

  function setupRipples() {
    $$('.detail-btn, .area-btn').forEach((btn) => {
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
    applyTheme();
    stabilizeLayout();
    entrance();
    setupCardHover();
    setupRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
