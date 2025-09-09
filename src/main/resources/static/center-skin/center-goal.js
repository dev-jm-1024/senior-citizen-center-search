// Center Goal - Navigation Goal Selection Interactive Effects
// - Uses vanilla JS + Anime.js for animations
// - Maintains design consistency with center-waypoints.js
// - Optimized for radio button selection

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupDistrictThemes() {
    $$('.region-group').forEach((group) => {
      const title = group.querySelector('.region-title');
      if (!title) return;
      
      const text = title.textContent.trim();
      let districtClass = '';
      let districtColor = '';
      
      if (text.includes('수정구')) {
        districtClass = 'sujeong';
        districtColor = '#DD164B';
      } else if (text.includes('분당구')) {
        districtClass = 'bundang';
        districtColor = '#0175C0';
      } else if (text.includes('중원구')) {
        districtClass = 'jungwon';
        districtColor = '#F8AC59';
      }
      
      if (districtClass) {
        group.classList.add(districtClass);
        title.style.color = districtColor;
        title.style.borderColor = districtColor;
        
        // 해당 그룹의 라디오 버튼들에도 테마 적용
        const radios = group.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
          radio.style.borderColor = districtColor;
          
          // 라디오 버튼 변경 이벤트에서 색상 유지
          radio.addEventListener('change', (e) => {
            if (e.target.checked) {
              e.target.style.backgroundColor = districtColor;
              e.target.style.borderColor = districtColor;
            }
          });
        });
      }
    });
  }

  function setupButtonRipples() {
    $$('.btn, .location-item').forEach((btn) => {
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
        if (window.anime && !item.classList.contains('selected-item')) {
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
        if (window.anime && !item.classList.contains('selected-item')) {
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
    $$('input[name="selectedGoal"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const item = e.target.closest('.location-item');
        
        console.log('🎯 라디오 버튼 변경:', radio.getAttribute('data-name'), e.target.checked ? '선택' : '해제');
        
        // Clear all other selections first
        $$('.location-item').forEach(otherItem => {
          otherItem.classList.remove('selected-item');
        });
        
        if (e.target.checked) {
          item.classList.add('selected-item');
          
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
        } else {
          // 🔧 FIX: 해제 시 시각적 효과 완전 제거
          if (window.anime) {
            anime({
              targets: radio,
              scale: [1, 0.9, 1],
              duration: 150,
              easing: 'easeOutQuad'
            });
            
            anime({
              targets: item,
              translateY: 0,
              scale: 1,
              duration: 200,
              easing: 'easeOutQuad'
            });
          }
        }
      });
    });
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

  function enhancedToggleRadio(element) {
    const radio = element.querySelector('input[type="radio"]');
    if (!radio) return;
    
    // Clear all other selections
    $$('input[name="selectedGoal"]').forEach(r => {
      r.checked = false;
      const item = r.closest('.location-item');
      if (item) {
        item.classList.remove('selected-item');
      }
    });
    
    // Select this radio
    radio.checked = true;
    element.classList.add('selected-item');
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    radio.dispatchEvent(event);
    
    // Animation feedback
    if (window.anime) {
      anime({
        targets: element,
        scale: [1, 1.05, 1],
        duration: 400,
        easing: 'easeOutBack'
      });
    }
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
    
    // 버튼은 항상 초록색으로 통일
    let themeColor = 'linear-gradient(135deg, #28a745, #218838)';
    
    alertBox.innerHTML = `
      <p style="margin: 0 0 16px 0; color: #333; font-weight: 500;">${message}</p>
      <button style="
        background: ${themeColor};
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

  function enhancedFindRoute() {
    const selectedGoal = $('input[name="selectedGoal"]:checked');

    if (!selectedGoal) {
      showCustomAlert('도착지를 선택해주세요.');
      return;
    }

    // Loading animation
    const findRouteBtn = $('#findRouteBtn');
    if (findRouteBtn) {
      findRouteBtn.disabled = true;
      findRouteBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center;">
          <span style="width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></span>
          검색 중...
        </span>
      `;
      
      // Add spin animation if not exists
      if (!document.querySelector('style[data-spin]')) {
        const style = document.createElement('style');
        style.setAttribute('data-spin', 'true');
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
    }

    setTimeout(() => {
      // 모든 폼 데이터 수집
      const startCoords = $('input[name="start"]').value;
      const startName = $('input[name="startName"]').value;
      const waypoints = $('input[name="waypoints"]').value;
      const waypointNames = $('input[name="waypointNames"]').value;
      const goalCoords = selectedGoal.value;
      const goalName = selectedGoal.getAttribute('data-name');

      // 결과 페이지로 이동하는 URL 구성
      let url = `/center/nav/result?start=${encodeURIComponent(startCoords)}&startName=${encodeURIComponent(startName)}`;

      if (waypoints && waypoints !== 'null' && waypoints !== '') {
        url += `&waypoints=${encodeURIComponent(waypoints)}`;
      }

      if (waypointNames && waypointNames !== 'null' && waypointNames !== '') {
        url += `&waypointNames=${encodeURIComponent(waypointNames)}`;
      }

      url += `&goal=${encodeURIComponent(goalCoords)}&goalName=${encodeURIComponent(goalName)}`;

      window.location.href = url;
    }, 800);
  }

  function setupEnhancedRadioSelection() {
    // Enhanced radio click handling
    $$('.location-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking directly on radio
        if (e.target.type === 'radio') return;
        
        const radio = item.querySelector('input[type="radio"]');
        if (radio) {
          enhancedToggleRadio(item);
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
    $$('.btn').forEach(btn => {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    });
    
    // 🔧 FIX: 경로 요약 가시성 보장
    const routeSummary = $('.route-summary');
    if (routeSummary) {
      routeSummary.style.opacity = '1';
      routeSummary.style.visibility = 'visible';
    }
  }

  function setupHeaderAnimations() {
    const header = $('.header');
    const content = $('.content');
    const routeSummary = $('.route-summary');
    
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
    
    if (routeSummary && window.anime) {
      anime({
        targets: routeSummary,
        translateY: [15, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 100,
        easing: 'easeOutQuad'
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

  function setupRouteSummaryAnimations() {
    const routeItems = $$('.route-item');
    
    // Staggered entrance for route items
    routeItems.forEach((item, index) => {
      if (window.anime) {
        anime({
          targets: item,
          opacity: [0, 1],
          translateX: [-20, 0],
          duration: 600,
          delay: index * 100 + 300,
          easing: 'easeOutQuart'
        });
      }
    });
    
    // Icon hover effects
    $$('.route-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        if (window.anime) {
          anime({
            targets: icon,
            scale: [1, 1.1],
            rotate: [0, 5],
            duration: 300,
            easing: 'easeOutBack'
          });
        }
      });
      
      icon.addEventListener('mouseleave', () => {
        if (window.anime) {
          anime({
            targets: icon,
            scale: [null, 1],
            rotate: [null, 0],
            duration: 300,
            easing: 'easeOutQuart'
          });
        }
      });
    });
  }

  function disableStartAndWaypointLocations() {
    const startCoords = $('input[name="start"]')?.value;
    const startName = $('input[name="startName"]')?.value;
    const waypoints = $('input[name="waypoints"]')?.value;
    const waypointNames = $('input[name="waypointNames"]')?.value;
    
    console.log('🎯 출발지 좌표:', startCoords);
    console.log('🎯 출발지 이름:', startName);
    console.log('🛤️ 경유지 좌표:', waypoints);
    console.log('🛤️ 경유지 이름:', waypointNames);
    
    // 경유지 좌표 배열로 변환
    const waypointCoordsList = waypoints && waypoints !== 'null' && waypoints !== '' 
      ? waypoints.split('|') 
      : [];
    const waypointNamesList = waypointNames && waypointNames !== 'null' && waypointNames !== '' 
      ? waypointNames.split('|') 
      : [];
    
    // 모든 도착지 라디오 버튼 확인
    $$('input[name="selectedGoal"]').forEach(radio => {
      const goalCoords = radio.value;
      const goalName = radio.getAttribute('data-name');
      const item = radio.closest('.location-item');
      const locationInfo = item.querySelector('.location-info');
      
      let shouldDisable = false;
      let badgeType = '';
      let badgeText = '';
      let alertMessage = '';
      
      // 출발지와 비교
      if (startCoords && goalCoords === startCoords) {
        shouldDisable = true;
        badgeType = 'start';
        badgeText = '🚩 출발지';
        alertMessage = '출발지로 설정된 위치는 도착지로 선택할 수 없습니다.';
        console.log(`🚩 출발지로 설정됨: ${goalName} (${goalCoords})`);
      }
      // 경유지와 비교
      else if (waypointCoordsList.includes(goalCoords)) {
        const waypointIndex = waypointCoordsList.indexOf(goalCoords);
        const waypointName = waypointNamesList[waypointIndex] || '경유지';
        shouldDisable = true;
        badgeType = 'waypoint';
        badgeText = '🛤️ 경유지';
        alertMessage = `경유지로 설정된 위치는 도착지로 선택할 수 없습니다. (경유지: ${waypointName})`;
        console.log(`🛤️ 경유지로 설정됨: ${goalName} (${goalCoords})`);
      }
      
      if (shouldDisable) {
        // 라디오 버튼 비활성화
        radio.disabled = true;
        radio.checked = false;
        
        // 시각적 표시
        if (badgeType === 'start') {
          item.classList.add('start-location-item');
        } else if (badgeType === 'waypoint') {
          item.classList.add('waypoint-location-item');
        }
        
        // 배지 추가
        if (locationInfo && !locationInfo.querySelector(`.${badgeType}-badge`)) {
          const badge = document.createElement('div');
          badge.className = `${badgeType}-badge`;
          badge.innerHTML = badgeText;
          locationInfo.appendChild(badge);
        }
        
        // 클릭 시 알림 표시
        item.addEventListener('click', (e) => {
          e.preventDefault();
          showCustomAlert(alertMessage);
        }, { once: false });
      }
    });
  }

  function init() {
    // 🔧 FIX: 즉시 레이아웃 안정화 (최우선)
    ensureLayoutStability();
    
    // 🚩 출발지 및 경유지와 동일한 도착지 비활성화
    disableStartAndWaypointLocations();
    
    setupDistrictThemes();
    setupButtonRipples();
    setupLocationItemAnimations();
    setupRadioAnimations();
    setupScrollAnimations();
    setupEnhancedRadioSelection();
    setupHeaderAnimations();
    setupRouteSummaryAnimations();
    
    // 🔧 FIX: 다시 한번 레이아웃 안정화
    setTimeout(() => {
      ensureLayoutStability();
    }, 50);
    
    // Make enhanced navigation functions globally available
    window.findRoute = enhancedFindRoute;
    window.enhancedToggleRadio = enhancedToggleRadio;
    
    // Enhanced updateGoalSelection function (override existing)
    window.updateGoalSelection = function() {
      const selectedGoal = $('input[name="selectedGoal"]:checked');
      const findRouteBtn = $('#findRouteBtn');

      // 모든 location-item에서 선택된 스타일 제거
      $$('.location-item').forEach(item => {
        item.classList.remove('selected-item');
      });

      if (selectedGoal) {
        findRouteBtn.disabled = false;
        findRouteBtn.innerHTML = '🔍 경로 검색하기';
        findRouteBtn.style.opacity = '1';
        selectedGoal.closest('.location-item').classList.add('selected-item');
      } else {
        findRouteBtn.disabled = true;
        findRouteBtn.innerHTML = '🎯 도착지를 선택해주세요';
        findRouteBtn.style.opacity = '1';
      }
    };
    
    // 🔍 디버깅: 도착지 상태 확인 함수 추가
    window.checkGoalStatus = function() {
      const startCoords = $('input[name="start"]')?.value;
      const startName = $('input[name="startName"]')?.value;
      const waypoints = $('input[name="waypoints"]')?.value;
      const waypointNames = $('input[name="waypointNames"]')?.value;
      const disabledGoals = $$('input[name="selectedGoal"]:disabled');
      
      console.log('=== 도착지 선택 상태 확인 ===');
      console.log('출발지:', startName, '(' + startCoords + ')');
      console.log('경유지:', waypointNames || '없음');
      console.log('비활성화된 도착지 수:', disabledGoals.length);
      
      disabledGoals.forEach((radio, index) => {
        const item = radio.closest('.location-item');
        const isStart = item.classList.contains('start-location-item');
        const isWaypoint = item.classList.contains('waypoint-location-item');
        const type = isStart ? '🚩 출발지' : isWaypoint ? '🛤️ 경유지' : '❌ 기타';
        console.log(`${index + 1}. ${radio.getAttribute('data-name')}: ${type}`);
      });
      
      return {
        startCoords,
        startName,
        waypoints,
        waypointNames,
        disabledCount: disabledGoals.length
      };
    };
    
    console.log('Center goal interactions initialized');
    console.log('🎮 디버깅 함수: window.checkGoalStatus() 사용 가능');
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