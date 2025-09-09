// Center Choose Locate - Interactive effects consistent with main design
// - Uses vanilla JS + Anime.js for animations
// - Maintains design consistency with index.js

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupDistrictThemes() {
    $$('.district').forEach((district) => {
      const title = district.querySelector('h2');
      if (!title) return;
      
      const text = title.textContent.trim();
      if (text.includes('수정구')) {
        district.classList.add('sujeong');
      } else if (text.includes('분당구')) {
        district.classList.add('bundang');
      } else if (text.includes('중원구')) {
        district.classList.add('jungwon');
      }
    });
  }

  function setupButtonRipples() {
    $$('.confirm-btn, .center-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Don't add ripple to center-item checkbox clicks
        if (btn.classList.contains('center-item') && e.target.type === 'checkbox') {
          return;
        }
        
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

  function setupCenterItemAnimations() {
    $$('.center-item').forEach((item, index) => {
      // Staggered entrance animation
      if (window.anime) {
        anime({
          targets: item,
          translateX: [-20, 0],
          opacity: [0, 1],
          duration: 500,
          delay: index * 50,
          easing: 'easeOutQuad'
        });
      }

      // Enhanced hover effects
      item.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime.remove(item);
          anime({
            targets: item,
            translateY: [-2, -4],
            scale: [1, 1.02],
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
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      });
    });
  }

  function setupCheckboxAnimations() {
    $$('.center-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const item = e.target.closest('.center-item');
        
        if (e.target.checked) {
          item.classList.add('selected');
          if (window.anime) {
            anime({
              targets: checkbox,
              scale: [1, 1.2, 1],
              duration: 300,
              easing: 'easeOutBack'
            });
          }
        } else {
          item.classList.remove('selected');
          if (window.anime) {
            anime({
              targets: checkbox,
              scale: [1, 0.8, 1],
              duration: 200,
              easing: 'easeOutQuad'
            });
          }
        }
      });
    });
  }

  function setupConfirmButtonState() {
    const confirmBtn = $('.confirm-btn');
    const selectedCount = $('#selectedCount');
    
    function updateButtonState() {
      const checkedBoxes = $$('input[type="checkbox"]:checked');
      const count = checkedBoxes.length;
      
      if (confirmBtn) {
        if (count === 0) {
          confirmBtn.disabled = true;
          confirmBtn.textContent = '경로당을 선택해주세요';
        } else {
          confirmBtn.disabled = false;
          confirmBtn.textContent = `선택한 ${count}개 경로당 확인하기`;
        }
      }
      
      if (selectedCount) {
        selectedCount.textContent = `선택된 경로당: ${count}개 (최대 10개)`;
        
        // Animate count change
        if (window.anime) {
          anime({
            targets: selectedCount,
            scale: [1, 1.1, 1],
            duration: 200,
            easing: 'easeOutQuad'
          });
        }
      }
    }
    
    // Listen for checkbox changes
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        updateButtonState();
      }
    });
    
    // Initial state
    updateButtonState();
  }

  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.center-item');
          items.forEach((item, index) => {
            if (window.anime) {
              anime({
                targets: item,
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 400,
                delay: index * 50,
                easing: 'easeOutQuad'
              });
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    $$('.center-list').forEach(list => {
      observer.observe(list);
    });
  }

  function enhancedToggleCheck(element) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    const checkedBoxes = $$('input[type="checkbox"]:checked');

    // Check limit before toggling
    if (!checkbox.checked && checkedBoxes.length >= 10) {
      // Shake animation for feedback
      if (window.anime) {
        anime({
          targets: element,
          translateX: [-10, 10, -8, 8, -6, 6, 0],
          duration: 400,
          easing: 'easeOutQuad'
        });
      }
      
      // Show styled alert
      showCustomAlert('최대 10개까지만 선택 가능합니다.');
      return;
    }

    checkbox.checked = !checkbox.checked;
    
    // Trigger change event for other handlers
    const event = new Event('change', { bubbles: true });
    checkbox.dispatchEvent(event);
  }

  function showCustomAlert(message) {
    // Create custom alert overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;
    
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
      background: rgba(255,255,255,0.95);
      padding: 24px 32px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 300px;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    `;
    
    alertBox.innerHTML = `
      <p style="margin: 0 0 16px 0; color: #333; font-weight: 500;">${message}</p>
      <button style="
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
      " onclick="this.closest('[style*=fixed]').remove()">확인</button>
    `;
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
      alertBox.style.transform = 'scale(1)';
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 3000);
  }

  function ensureLayoutStability() {
    // 🔧 FIX: 메뉴바로 인한 레이아웃 밀림 방지
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // 강제로 기본 가시성 보장
    const mainContainer = $('.main-container');
    if (mainContainer) {
      mainContainer.style.opacity = '1';
      mainContainer.style.visibility = 'visible';
      mainContainer.style.transform = 'translateY(0)';
    }
    
    // 모든 district 요소 안정화
    $$('.district').forEach(district => {
      district.style.opacity = '1';
      district.style.visibility = 'visible';
      district.style.transform = 'translateY(0)';
    });
    
    // 모든 center-item 요소 안정화
    $$('.center-item').forEach(item => {
      item.style.opacity = '1';
      item.style.visibility = 'visible';
      item.style.transform = 'translateY(0) translateX(0)';
    });
  }

  function init() {
    // 우선 레이아웃 안정화
    ensureLayoutStability();
    
    setupDistrictThemes();
    setupButtonRipples();
    setupCenterItemAnimations();
    setupCheckboxAnimations();
    setupConfirmButtonState();
    setupScrollAnimations();
    
    // Make enhanced toggle function globally available
    window.toggleCheck = enhancedToggleCheck;
    
    // Enhanced confirm selection
    window.confirmSelection = function() {
      const checkedBoxes = $$('input[type="checkbox"]:checked');

      if (checkedBoxes.length === 0) {
        showCustomAlert('경로당을 선택해주세요.');
        return;
      }

      // Loading animation
      const confirmBtn = $('.confirm-btn');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `
          <span style="display: inline-flex; align-items: center;">
            <span style="width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></span>
            처리 중...
          </span>
        `;
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      // Collect selected IDs
      const selectedIds = Array.from(checkedBoxes).map(checkbox => checkbox.value);
      const idsParam = selectedIds.join(',');
      
      // Redirect after short delay for visual feedback
      setTimeout(() => {
        window.location.href = `/center/locate?ids=${idsParam}`;
      }, 500);
    };
  }

  // Initialize when DOM is ready with fallback
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM이 이미 로드된 경우 즉시 실행
    init();
  }
  
  // 추가 안전장치: 페이지 로드 완료 후 한 번 더 안정화
  window.addEventListener('load', () => {
    setTimeout(() => {
      ensureLayoutStability();
    }, 100);
  });
  
  // 리사이즈 시에도 레이아웃 보정
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      ensureLayoutStability();
    });
  });
})();
