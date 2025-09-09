// Center Start - Navigation Start Point Selection Interactive Effects
// - Uses vanilla JS + Anime.js for animations
// - Maintains design consistency with center-choose-locate.js
// - Optimized for radio button selection

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupDistrictThemes() {
    $$('.region-group').forEach((group) => {
      const title = group.querySelector('.region-title');
      if (!title) return;
      
      const text = title.textContent.trim();
      if (text.includes('수정구')) {
        group.classList.add('sujeong');
        title.style.color = '#DD164B';
        title.style.borderColor = '#DD164B';
      } else if (text.includes('분당구')) {
        group.classList.add('bundang');
        title.style.color = '#0175C0';
        title.style.borderColor = '#0175C0';
      } else if (text.includes('중원구')) {
        group.classList.add('jungwon');
        title.style.color = '#F8AC59';
        title.style.borderColor = '#F8AC59';
      }
    });
  }

  function setupButtonRipples() {
    $$('.btn-next, .location-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Don't add ripple to location-item radio clicks
        if (btn.classList.contains('location-item') && e.target.type === 'radio') {
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

  function setupLocationItemAnimations() {
    $$('.location-item').forEach((item, index) => {
      // 🔧 FIX: 초기 레이아웃 강제 안정화
      item.style.opacity = '1';
      item.style.visibility = 'visible';
      item.style.transform = 'translateX(0) translateY(0)';
      
      // Staggered entrance animation (조건부)
      if (window.anime && window.getComputedStyle(item).opacity !== '1') {
        anime({
          targets: item,
          translateX: [-30, 0],
          opacity: [0, 1],
          duration: 600,
          delay: index * 80,
          easing: 'easeOutQuad'
        });
      }

      // Enhanced hover effects
      item.addEventListener('mouseenter', () => {
        if (window.anime && !item.classList.contains('selected')) {
          anime.remove(item);
          anime({
            targets: item,
            translateY: [-2, -6],
            scale: [1, 1.02],
            duration: 250,
            easing: 'easeOutQuad'
          });
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.anime && !item.classList.contains('selected')) {
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

  function setupRadioAnimations() {
    $$('input[name="selectedLocation"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const item = e.target.closest('.location-item');
        
        // Remove selected class from all items
        $$('.location-item').forEach(otherItem => {
          otherItem.classList.remove('selected');
          if (window.anime) {
            anime({
              targets: otherItem,
              translateY: 0,
              scale: 1,
              duration: 200,
              easing: 'easeOutQuad'
            });
          }
        });
        
        // Add selected class and animation to current item
        if (e.target.checked) {
          item.classList.add('selected');
          
          if (window.anime) {
            // Unified checkbox-style pop animation
            anime({
              targets: radio,
              scale: [1, 1.3, 1.1],
              duration: 400,
              easing: 'easeOutBack'
            });
            
            // Item selection animation
            anime({
              targets: item,
              translateY: [0, -2],
              scale: [1, 1.01],
              duration: 300,
              easing: 'easeOutQuad'
            });
          }
        }
      });
    });
  }

  function setupSubmitButtonState() {
    const nextBtn = $('#nextBtn');
    
    function updateButtonState() {
      const selectedRadio = $('input[name="selectedLocation"]:checked');
      
      if (nextBtn) {
        if (selectedRadio) {
          nextBtn.disabled = false;
          nextBtn.innerHTML = '🚀 경유지 선택하기';
          nextBtn.style.opacity = '1';
          
          // Button enable animation
          if (window.anime) {
            anime({
              targets: nextBtn,
              scale: [1, 1.05, 1],
              duration: 300,
              easing: 'easeOutBack'
            });
          }
        } else {
          nextBtn.disabled = true;
          nextBtn.innerHTML = '📍 출발지를 선택해주세요';
          nextBtn.style.opacity = '1'; // 🔧 FIX: 비활성화 상태에서도 잘 보이게
        }
      }
    }
    
    // Listen for radio button changes
    document.addEventListener('change', (e) => {
      if (e.target.name === 'selectedLocation') {
        updateButtonState();
      }
    });
    
    // 🔧 FIX: 즉시 초기 상태 설정
    setTimeout(() => {
      updateButtonState();
    }, 100);
  }

  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.location-item');
          items.forEach((item, index) => {
            if (window.anime) {
              anime({
                targets: item,
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 500,
                delay: index * 100,
                easing: 'easeOutQuad'
              });
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    $$('.location-grid').forEach(grid => {
      observer.observe(grid);
    });
  }

  function enhancedGoToWaypoints() {
    const selectedLocation = $('input[name="selectedLocation"]:checked');

    if (!selectedLocation) {
      showCustomAlert('출발지를 선택해주세요.');
      return;
    }

    // Loading animation
    const nextBtn = $('#nextBtn');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = `
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

    const coordinates = selectedLocation.value;
    const locationName = selectedLocation.getAttribute('data-name');

    // Redirect after short delay for visual feedback
    setTimeout(() => {
      const url = `/center/nav/waypoints?start=${encodeURIComponent(coordinates)}&startName=${encodeURIComponent(locationName)}`;
      window.location.href = url;
    }, 800);
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

  function setupEnhancedRadioSelection() {
    // Enhanced radio button click handling
    $$('.location-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking directly on radio button
        if (e.target.type === 'radio') return;
        
        const radio = item.querySelector('input[type="radio"]');
        if (radio && !radio.checked) {
          radio.checked = true;
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          radio.dispatchEvent(event);
        }
      });
    });
  }

  function ensureLayoutStability() {
    // 🔧 FIX: 메뉴바로 인한 레이아웃 밀림 방지
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // 강제로 기본 가시성 보장
    const container = $('.container');
    if (container) {
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      container.style.transform = 'translateY(0)';
    }
    
    // 모든 region-group 요소 안정화
    $$('.region-group').forEach(group => {
      group.style.opacity = '1';
      group.style.visibility = 'visible';
      group.style.transform = 'translateY(0)';
    });
    
    // 🔧 FIX: 모든 location-item 요소 강제 안정화
    $$('.location-item').forEach(item => {
      item.style.opacity = '1';
      item.style.visibility = 'visible';
      item.style.transform = 'translateY(0) translateX(0)';
      item.style.display = 'flex'; // 그리드 레이아웃 안정화
    });
    
    // 🔧 FIX: 그리드 컨테이너 안정화
    $$('.location-grid').forEach(grid => {
      grid.style.display = 'grid';
      grid.style.visibility = 'visible';
    });
    
    // 🔧 FIX: 버튼 가시성 보장
    const nextBtn = $('#nextBtn');
    if (nextBtn) {
      nextBtn.style.opacity = '1';
      nextBtn.style.visibility = 'visible';
    }
  }

  function setupHeaderAnimations() {
    const header = $('.header');
    const content = $('.content');
    
    if (header && window.anime) {
      anime({
        targets: header,
        translateY: [-30, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 800,
        easing: 'easeOutQuad'
      });
      
      // Apple-style 미묘한 호버 효과
      header.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime({
            targets: header,
            translateY: [0, -1],
            scale: [1, 1.005],
            duration: 400,
            easing: 'easeOutQuart'
          });
        }
      });
      
      header.addEventListener('mouseleave', () => {
        if (window.anime) {
          anime({
            targets: header,
            translateY: 0,
            scale: 1,
            duration: 400,
            easing: 'easeOutQuart'
          });
        }
      });
    }
    
    if (content && window.anime) {
      anime({
        targets: content,
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.98, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutQuad'
      });
    }
  }

  function init() {
    // 🔧 FIX: 즉시 레이아웃 안정화 (최우선)
    ensureLayoutStability();
    
    setupDistrictThemes();
    setupButtonRipples();
    setupLocationItemAnimations();
    setupRadioAnimations();
    setupSubmitButtonState();
    setupScrollAnimations();
    setupEnhancedRadioSelection();
    setupHeaderAnimations();
    
    // 🔧 FIX: 다시 한번 레이아웃 안정화
    setTimeout(() => {
      ensureLayoutStability();
    }, 50);
    
    // Make enhanced navigation function globally available
    window.goToWaypoints = enhancedGoToWaypoints;
    
    // Enhanced updateSubmitButton function (override existing)
    window.updateSubmitButton = function() {
      const selectedLocation = $('input[name="selectedLocation"]:checked');
      const nextBtn = $('#nextBtn');

      if (nextBtn) {
        if (selectedLocation) {
          nextBtn.disabled = false;
          nextBtn.innerHTML = '🚀 경유지 선택하기';
          nextBtn.style.opacity = '1';
        } else {
          nextBtn.disabled = true;
          nextBtn.innerHTML = '📍 출발지를 선택해주세요';
          nextBtn.style.opacity = '1';
        }
      }
    };
    
    console.log('Center start interactions initialized');
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
