// Center Locate - Interactive effects consistent with main design
// - Uses vanilla JS + Anime.js for animations
// - Maintains design consistency with index.js and center-choose-locate.js

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupRippleEffects() {
    $$('.back-btn, .center-item').forEach((element) => {
      element.addEventListener('click', (e) => {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        element.appendChild(ripple);
        
        if (window.anime) {
          anime({ 
            targets: ripple, 
            scale: [0, 1], 
            opacity: [0.6, 0], 
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

  function setupHoverEffects() {
    // Back button hover enhancement
    const backBtn = $('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime.remove(backBtn);
          anime({
            targets: backBtn,
            translateY: [-2, -4],
            scale: [1, 1.02],
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });

      backBtn.addEventListener('mouseleave', () => {
        if (window.anime) {
          anime.remove(backBtn);
          anime({
            targets: backBtn,
            translateY: 0,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });
    }

    // Center item hover effects
    $$('.center-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime.remove(item);
          anime({
            targets: item,
            translateY: [-2, -4],
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.anime) {
          anime.remove(item);
          anime({
            targets: item,
            translateY: 0,
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });
    });

    // Legend item hover effects
    $$('.legend-item').forEach((item) => {
      const indicator = item.querySelector('.legend-color');
      if (indicator) {
        item.addEventListener('mouseenter', () => {
          if (window.anime) {
            anime({
              targets: indicator,
              scale: [1, 1.2],
              duration: 200,
              easing: 'easeOutBack'
            });
          }
        });

        item.addEventListener('mouseleave', () => {
          if (window.anime) {
            anime({
              targets: indicator,
              scale: 1,
              duration: 200,
              easing: 'easeOutQuad'
            });
          }
        });
      }
    });
  }

  function setupMapEnhancements() {
    // Map container loading effect
    const mapContainer = $('.map-container');
    if (mapContainer) {
      // Add loading shimmer effect before map loads
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: shimmer 2s infinite;
        pointer-events: none;
        z-index: 1;
      `;
      
      // Add shimmer keyframes
      if (!document.querySelector('#shimmer-style')) {
        const style = document.createElement('style');
        style.id = 'shimmer-style';
        style.textContent = `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `;
        document.head.appendChild(style);
      }
      
      mapContainer.appendChild(shimmer);
      
      // Remove shimmer when map is loaded
      const checkMapLoaded = () => {
        if (window.naverLocateMap || document.querySelector('#map canvas')) {
          setTimeout(() => {
            if (shimmer.parentNode) {
              if (window.anime) {
                anime({
                  targets: shimmer,
                  opacity: [1, 0],
                  duration: 500,
                  complete: () => shimmer.remove()
                });
              } else {
                shimmer.remove();
              }
            }
          }, 1000);
        } else {
          setTimeout(checkMapLoaded, 100);
        }
      };
      
      checkMapLoaded();
    }
  }

  function enhanceMapInteractions() {
    // Override the original focusOnMarker function to add animations
    const originalFocusOnMarker = window.focusOnMarker;
    
    window.focusOnMarker = function(locationId) {
      // Call original function
      if (originalFocusOnMarker) {
        originalFocusOnMarker(locationId);
      }
      
      // Add visual feedback
      const clickedItem = $$('.center-item').find(item => {
        const onclick = item.getAttribute('onclick');
        return onclick && onclick.includes(locationId.toString());
      });
      
      if (clickedItem && window.anime) {
        // Highlight effect
        anime({
          targets: clickedItem,
          backgroundColor: ['rgba(255, 255, 255, 0.1)', 'rgba(102, 126, 234, 0.2)', 'rgba(255, 255, 255, 0.1)'],
          duration: 800,
          easing: 'easeInOutQuad'
        });
        
        // Scale effect on district indicator
        const indicator = clickedItem.querySelector('.district-indicator');
        if (indicator) {
          anime({
            targets: indicator,
            scale: [1, 1.3, 1],
            duration: 600,
            easing: 'easeOutBack'
          });
        }
      }
    };
  }

  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.classList.contains('center-item')) {
            if (window.anime) {
              anime({
                targets: element,
                translateX: [20, 0],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutQuad'
              });
            }
          }
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });
    
    $$('.center-item').forEach(item => {
      observer.observe(item);
    });
  }

  function ensureLayoutStability() {
    // Force visibility for all main elements
    const container = $('.container');
    if (container) {
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      container.style.transform = 'translateY(0)';
    }
    
    // Ensure all animated elements are visible as fallback
    $$('.back-btn, .header, .selected-info, .map-container, .center-list').forEach(element => {
      element.style.opacity = '1';
      element.style.visibility = 'visible';
    });
    
    $$('.center-item').forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    });
  }

  function setupPerformanceOptimizations() {
    // Optimize map resize handling
    let resizeTimeout;
    const originalResizeHandler = window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.naverLocateMap) {
          window.naverLocateMap.refresh();
        }
      }, 150);
    });
    
    // Smooth scroll to map when center item is clicked
    $$('.center-item').forEach(item => {
      item.addEventListener('click', () => {
        const mapContainer = $('.map-container');
        if (mapContainer) {
          mapContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });
    });
  }

  function init() {
    // Ensure layout stability first
    ensureLayoutStability();
    
    setupRippleEffects();
    setupHoverEffects();
    setupMapEnhancements();
    enhanceMapInteractions();
    setupScrollAnimations();
    setupPerformanceOptimizations();
    
    console.log('Center Locate interactions initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Additional safety net for layout stability
  window.addEventListener('load', () => {
    setTimeout(() => {
      ensureLayoutStability();
    }, 100);
  });
  
  // Handle resize events
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      ensureLayoutStability();
    });
  });
})();
