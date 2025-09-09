// Menu Bar - Interactive effects consistent with main design (Fixed Layout Issues)

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupMenuRipples() {
    $$('.menu-btn-group button').forEach((btn) => {
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

        if (window.anime) {
          anime({
            targets: ripple,
            scale: [0, 1],
            opacity: [0.7, 0],
            duration: 600,
            easing: 'easeOutQuad',
            complete: () => ripple.remove()
          });
        } else {
          // Fallback animation
          ripple.style.transition = 'transform .6s ease, opacity .6s ease';
          requestAnimationFrame(() => {
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';
          });
          setTimeout(() => ripple.remove(), 600);
        }
      });
    });
  }

  function setupMenuHoverEffects() {
    $$('.menu-btn-group button').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime.remove(btn);
          // 🔧 FIX: Reduced animation values to prevent layout shift
          anime({
            targets: btn,
            translateY: [-1, -2], // Reduced from [-2, -4]
            scale: [1, 1.01],     // Reduced from [1, 1.05]
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (window.anime) {
          anime.remove(btn);
          anime({
            targets: btn,
            translateY: 0,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });
    });
  }

  function enhanceSpecialButtons() {
    // View Locate 버튼 특별한 펄스 효과
    const viewLocateBtn = $('#view-locate');
    if (viewLocateBtn) {
      const createPulse = () => {
        if (window.anime) {
          // 🔧 FIX: Reduced pulse effect to prevent layout shift
          anime({
            targets: viewLocateBtn,
            scale: [1, 1.005, 1], // Reduced from [1, 1.02, 1]
            duration: 2000,
            easing: 'easeInOutSine',
            complete: () => {
              setTimeout(createPulse, 3000);
            }
          });
        }
      };

      // 5초 후 펄스 효과 시작
      setTimeout(createPulse, 5000);

      // 클릭 시 특별한 효과
      viewLocateBtn.addEventListener('click', (e) => {
        if (window.anime) {
          // 🔧 FIX: Reduced click effect
          anime({
            targets: viewLocateBtn,
            scale: [1, 0.98, 1.02, 1], // Reduced scale values
            duration: 400,
            easing: 'easeOutBack'
          });
        }
      });
    }

    // Navigation 버튼 특별한 효과
    const navBtn = $('#nav-btn');
    if (navBtn) {
      // 클릭 시 회전 효과
      navBtn.addEventListener('click', (e) => {
        if (window.anime) {
          // 🔧 FIX: Maintained rotation but reduced scale
          anime({
            targets: navBtn,
            rotate: [0, 360],
            scale: [1, 0.98, 1], // Reduced from [1, 0.9, 1]
            duration: 600,
            easing: 'easeOutBack'
          });
        }
      });
    }
  }

  function setupKeyboardNavigation() {
    const buttons = $$('.menu-btn-group button');

    buttons.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        let targetIndex = index;

        switch(e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            targetIndex = (index + 1) % buttons.length;
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            targetIndex = (index - 1 + buttons.length) % buttons.length;
            break;
          case 'Home':
            e.preventDefault();
            targetIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            targetIndex = buttons.length - 1;
            break;
          default:
            return;
        }

        buttons[targetIndex].focus();
      });
    });
  }

  function setupResponsiveAdjustments() {
    const menuGroup = $('.menu-btn-group');
    if (!menuGroup) return;

    const adjustLayout = () => {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;

      // 🔧 FIX: Removed flexWrap adjustments that could cause layout issues
      // Instead, rely on CSS fixed dimensions

      if (isSmallMobile) {
        // menuGroup.style.maxWidth = '240px'; // Removed - rely on CSS
      } else if (isMobile) {
        // menuGroup.style.maxWidth = '280px'; // Removed - rely on CSS
      } else {
        // menuGroup.style.maxWidth = 'none'; // Removed - rely on CSS
      }
    };

    adjustLayout();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustLayout, 150);
    });
  }

  function addTooltips() {
    const tooltips = {
      'back-btn': '이전 페이지로 돌아갑니다',
      'home-btn': '홈페이지로 이동합니다',
      'create-btn': '새로운 경로당을 등록합니다',
      'view-locate': '선택한 경로당들의 위치를 한 번에 확인합니다',
      'nav-btn': '경로당 네비게이션을 이용합니다'
    };

    Object.entries(tooltips).forEach(([id, text]) => {
      const btn = $(`#${id}`);
      if (btn) {
        btn.setAttribute('title', text);
        btn.setAttribute('aria-label', text);
      }
    });
  }

  function setupSmoothTransitions() {
    // 페이지 전환 시 부드러운 효과
    $$('.menu-btn-group button').forEach(btn => {
      if (btn.onclick || btn.getAttribute('onclick')) {
        btn.addEventListener('click', (e) => {
          // 클릭 시 로딩 표시
          const originalText = btn.textContent;
          const originalHTML = btn.innerHTML;

          if (window.anime) {
            // 🔧 FIX: Reduced loading animation scale
            anime({
              targets: btn,
              scale: [1, 0.98, 1], // Reduced from [1, 0.9, 1]
              duration: 200,
              complete: () => {
                btn.style.opacity = '0.7';
                btn.innerHTML = '<span style="display: inline-flex; align-items: center;">처리중...</span>';

                // 원래 동작 실행 후 복원
                setTimeout(() => {
                  btn.innerHTML = originalHTML;
                  btn.style.opacity = '1';
                }, 1000);
              }
            });
          }
        });
      }
    });
  }

  // 🔧 FIX: Add layout stability function
  function ensureLayoutStability() {
    const menuGroup = $('.menu-btn-group');
    if (!menuGroup) return;

    // Force layout containment
    menuGroup.style.contain = 'layout style paint';

    // Prevent any transform origin issues
    menuGroup.style.transformOrigin = 'center center';

    // Ensure buttons maintain their dimensions
    $$('.menu-btn-group button').forEach(btn => {
      const computedStyle = window.getComputedStyle(btn);
      const width = computedStyle.width;
      const height = computedStyle.height;

      // Lock in the computed dimensions
      btn.style.width = width;
      btn.style.height = height;
      btn.style.flexShrink = '0';
    });
  }

  // 🔧 FIX: Add performance optimization
  function optimizePerformance() {
    const menuGroup = $('.menu-btn-group');
    if (!menuGroup) return;

    // Use will-change only during animations
    $$('.menu-btn-group button').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.willChange = 'transform';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.willChange = 'auto';
      });

      btn.addEventListener('animationend', () => {
        btn.style.willChange = 'auto';
      });

      btn.addEventListener('transitionend', () => {
        btn.style.willChange = 'auto';
      });
    });
  }

  function init() {
    setupMenuRipples();
    setupMenuHoverEffects();
    enhanceSpecialButtons();
    setupKeyboardNavigation();
    setupResponsiveAdjustments();
    addTooltips();
    setupSmoothTransitions();

    // 🔧 FIX: Add new stability and performance functions
    ensureLayoutStability();
    optimizePerformance();

    console.log('Menu bar interactions initialized with layout fixes');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 🔧 FIX: Re-apply layout stability after window load
  window.addEventListener('load', () => {
    setTimeout(() => {
      ensureLayoutStability();
    }, 100);
  });

  // 🔧 FIX: Handle resize events more carefully
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ensureLayoutStability();
    }, 250);
  });
})();