// Modern Login Page Interactions & Animations
(function() {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Animation utilities
  const ease = {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  };

  // Enhanced ripple effect with better physics
  function setupButtonRipples() {
    $$('.action-button').forEach(btn => {
      btn.addEventListener('click', createRippleEffect);
    });
  }

  function createRippleEffect(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      opacity: 0.6;
    `;

    btn.appendChild(ripple);

    // Use GSAP if available, otherwise fallback to Anime.js or CSS
    if (window.gsap) {
      window.gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    } else if (window.anime) {
      window.anime({
        targets: ripple,
        scale: [0, 1],
        opacity: [0.6, 0],
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => ripple.remove()
      });
    } else {
      // CSS fallback
      ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 600);
    }
  }

  // Enhanced button interactions
  function setupButtonInteractions() {
    $$('.action-button').forEach(btn => {
      let hoverTween;

      btn.addEventListener('mouseenter', () => {
        if (window.gsap) {
          hoverTween = window.gsap.to(btn, {
            y: -4,
            scale: 1.03,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          btn.style.transform = 'translateY(-4px) scale(1.03)';
          btn.style.transition = 'transform 0.3s ease';
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (window.gsap) {
          if (hoverTween) hoverTween.kill();
          window.gsap.to(btn, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        } else {
          btn.style.transform = 'translateY(0) scale(1)';
        }
      });

      btn.addEventListener('mousedown', () => {
        if (window.gsap) {
          window.gsap.to(btn, {
            scale: 0.98,
            duration: 0.1,
            ease: 'power2.out'
          });
        } else {
          btn.style.transform = 'translateY(-2px) scale(0.98)';
        }
      });

      btn.addEventListener('mouseup', () => {
        if (window.gsap) {
          window.gsap.to(btn, {
            scale: 1.03,
            duration: 0.2,
            ease: 'back.out(1.7)'
          });
        }
      });
    });
  }

  // Advanced input field interactions
  function setupInputInteractions() {
    $$('.login-input').forEach(input => {
      const wrapper = input.closest('.input-wrapper');
      const label = wrapper?.querySelector('.input-label');

      // Focus animations
      input.addEventListener('focus', () => {
        if (window.gsap) {
          window.gsap.to(input, {
            y: -2,
            scale: 1.01,
            duration: 0.3,
            ease: 'power2.out'
          });

          if (label) {
            window.gsap.to(label, {
              color: 'rgba(99, 102, 241, 0.9)',
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }

        // Add focus glow effect
        input.style.boxShadow = `
          0 8px 32px rgba(99, 102, 241, 0.25),
          0 0 0 1px rgba(99, 102, 241, 0.3) inset,
          0 0 20px rgba(99, 102, 241, 0.2)
        `;
      });

      input.addEventListener('blur', () => {
        if (window.gsap) {
          window.gsap.to(input, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          });

          if (label) {
            window.gsap.to(label, {
              color: 'rgba(255, 255, 255, 0.9)',
              scale: 1,
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        }

        // Remove focus glow
        input.style.boxShadow = '';
      });

      // Typing animation
      input.addEventListener('input', () => {
        if (window.gsap && input.value.length === 1) {
          // Small bounce when first character is typed
          window.gsap.to(input, {
            scale: 1.02,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
          });
        }
      });

      // Enhanced hover effects
      input.addEventListener('mouseenter', () => {
        if (!input.matches(':focus')) {
          if (window.gsap) {
            window.gsap.to(input, {
              y: -1,
              duration: 0.2,
              ease: 'power2.out'
            });
          }
        }
      });

      input.addEventListener('mouseleave', () => {
        if (!input.matches(':focus')) {
          if (window.gsap) {
            window.gsap.to(input, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
      });
    });
  }

  // Parallax effect for particles
  function setupParallaxEffects() {
    const particles = $('.particle');

    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.02;
        const x = mouseX * speed * 20;
        const y = mouseY * speed * 20;

        if (window.gsap) {
          window.gsap.to(particle, {
            x: x,
            y: y,
            duration: 2,
            ease: 'power2.out'
          });
        } else {
          particle.style.transform = `translate(${x}px, ${y}px)`;
          particle.style.transition = 'transform 2s ease-out';
        }
      });
    });
  }

  // Form validation with smooth feedback
  function setupFormValidation() {
    const form = $('.login-form');
    const inputs = $('.login-input');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      let isValid = true;

      inputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');

        // Remove existing error states
        wrapper?.classList.remove('error');

        if (!input.value.trim()) {
          isValid = false;
          wrapper?.classList.add('error');

          // Shake animation for invalid fields
          if (window.gsap) {
            window.gsap.to(input, {
              x: [-10, 10, -8, 8, -6, 6, -4, 4, -2, 2, 0],
              duration: 0.5,
              ease: 'power2.out'
            });
          } else if (window.anime) {
            window.anime({
              targets: input,
              translateX: [-10, 10, -8, 8, -6, 6, -4, 4, -2, 2, 0],
              duration: 500,
              easing: 'easeOutQuad'
            });
          }
        }
      });

      if (!isValid) {
        e.preventDefault();

        // Add error styles
        const style = document.createElement('style');
        style.textContent = `
          .input-wrapper.error .login-input {
            border-color: rgba(239, 68, 68, 0.6) !important;
            background: rgba(254, 226, 226, 0.1) !important;
            box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3) inset !important;
          }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
          document.head.removeChild(style);
          inputs.forEach(input => {
            input.closest('.input-wrapper')?.classList.remove('error');
          });
        }, 3000);
      }
    });
  }

  // Loading state for form submission
  function setupLoadingStates() {
    const form = $('.login-form');
    const submitBtn = $('.login-button');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', () => {
      const btnText = submitBtn.querySelector('.button-text');

      if (btnText) {
        const originalText = btnText.textContent;
        btnText.textContent = '로그인 중...';
        submitBtn.disabled = true;

        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
          <div class="spinner-ring"></div>
        `;

        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
          .loading-spinner {
            display: inline-block;
            margin-left: 8px;
          }
          .spinner-ring {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(spinnerStyle);
        submitBtn.appendChild(spinner);

        // Simulate loading (remove this in production)
        setTimeout(() => {
          btnText.textContent = originalText;
          submitBtn.disabled = false;
          spinner.remove();
          spinnerStyle.remove();
        }, 2000);
      }
    });
  }

  // Card tilt effect
  function setupCardTilt() {
    const card = $('.login-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const rotateX = deltaY * -5;
      const rotateY = deltaX * 5;

      if (window.gsap) {
        window.gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.3s ease-out';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.gsap) {
        window.gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform 0.5s ease-out';
      }
    });
  }

  // Enhanced keyboard navigation
  function setupKeyboardNavigation() {
    const inputs = $('.login-input');
    const button = $('.login-button');

    inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          if (index < inputs.length - 1) {
            // Focus next input
            inputs[index + 1].focus();

            // Smooth scroll to next input if needed
            inputs[index + 1].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          } else if (button) {
            // Focus submit button
            button.focus();
          }
        }

        if (e.key === 'Tab') {
          // Add tab focus animation
          setTimeout(() => {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('login-input')) {
              if (window.gsap) {
                window.gsap.from(focusedElement, {
                  scale: 0.98,
                  duration: 0.2,
                  ease: 'back.out(1.7)'
                });
              }
            }
          }, 10);
        }
      });
    });

    // Button keyboard interaction
    if (button) {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();

          // Visual feedback
          if (window.gsap) {
            window.gsap.to(button, {
              scale: 0.95,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'power2.out',
              onComplete: () => {
                button.click();
              }
            });
          } else {
            button.click();
          }
        }
      });
    }
  }

  // Initialize everything
  function init() {
    // Core interactions
    setupButtonRipples();
    setupButtonInteractions();
    setupInputInteractions();
    setupFormValidation();
    setupLoadingStates();
    setupKeyboardNavigation();

    // Enhanced effects
    setupParallaxEffects();
    setupCardTilt();

    // Performance optimization: use RAF for smooth animations
    const optimizeAnimations = () => {
      if (window.gsap) {
        // Set GSAP to use RAF
        window.gsap.ticker.fps(60);
      }
    };

    optimizeAnimations();

    // Add accessibility improvements
    const addA11ySupport = () => {
      // High contrast mode support
      const inputs = $('.login-input');
      inputs.forEach(input => {
        input.setAttribute('aria-label', input.placeholder);
      });

      // Reduced motion support
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');

        const style = document.createElement('style');
        style.textContent = `
          .reduced-motion *, .reduced-motion *::before, .reduced-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    addA11ySupport();

    console.log('🎨 Modern login page initialized with advanced interactions');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes for better performance
  document.addEventListener('visibilitychange', () => {
    const particles = $('.particle');
    particles.forEach(particle => {
      if (document.hidden) {
        particle.style.animationPlayState = 'paused';
      } else {
        particle.style.animationPlayState = 'running';
      }
    });
  });

})();