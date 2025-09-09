// Center Waypoints - Navigation Waypoints Selection Interactive Effects
// - Uses vanilla JS + Anime.js for animations
// - Maintains design consistency with center-start.js
// - Optimized for checkbox selection with max limit

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
  const MAX_WAYPOINTS = 5;
  let selectedCount = 0;

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
        
        // 해당 그룹의 체크박스들에도 테마 적용
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.style.borderColor = districtColor;
          
          // 체크박스 변경 이벤트에서 색상 유지
          checkbox.addEventListener('change', (e) => {
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
        // Don't add ripple to location-item checkbox clicks
        if (btn.classList.contains('location-item') && e.target.type === 'checkbox') {
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

  function setupCheckboxAnimations() {
    $$('input[name="waypoint"]').forEach((checkbox) => {
      console.log('🔗 체크박스 이벤트 리스너 등록:', checkbox.getAttribute('data-name')); // 디버깅용
      
      checkbox.addEventListener('change', (e) => {
        const item = e.target.closest('.location-item');
        const locationName = e.target.getAttribute('data-name');
        
        console.log('🎯 체크박스 애니메이션:', locationName, e.target.checked ? '선택' : '해제'); // 디버깅용
        
        // DOM 업데이트 확인
        setTimeout(() => {
          const allChecked = $$('input[name="waypoint"]:checked');
          console.log('💡 현재 선택된 체크박스 수:', allChecked.length);
        }, 10);
        
        if (e.target.checked) {
          item.classList.add('selected-item');
          // 체크 상태 클래스 추가
          checkbox.classList.add('checkbox-checked');
          
          if (window.anime) {
            // Checkbox pop animation
            anime({
              targets: checkbox,
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
          // 🔧 FIX: 해제 시 즉시 모든 선택 상태 완전 제거
          item.classList.remove('selected-item');
          checkbox.classList.remove('checkbox-checked');
          
          // 🔧 FIX: 체크박스 스타일 강제 리셋
          checkbox.style.transform = '';
          checkbox.style.background = '';
          checkbox.style.borderColor = '';
          checkbox.style.boxShadow = '';
          
          // 🔧 FIX: 아이템 스타일 강제 리셋
          item.style.background = '';
          item.style.borderColor = '';
          item.style.boxShadow = '';
          item.style.transform = '';
          
          if (window.anime) {
            // 체크박스 축소 애니메이션
            anime({
              targets: checkbox,
              scale: [1, 0.9, 1],
              duration: 150,
              easing: 'easeOutQuad'
            });
            
            // 아이템 기본 상태로 복귀
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

  function setupSelectionCounter() {
    const counterText = $('#counterText');
    
    function updateCounter() {
      const checkedBoxes = $$('input[name="waypoint"]:checked');
      selectedCount = checkedBoxes.length;
      
      console.log('🔍 카운터 업데이트:', selectedCount, '개 선택됨'); // 디버깅용
      
      if (counterText) {
        counterText.textContent = `선택된 경유지: ${selectedCount}개 / 최대 ${MAX_WAYPOINTS}개`;
        
        // Counter animation
        if (window.anime) {
          anime({
            targets: counterText.parentElement,
            scale: [1, 1.05, 1],
            duration: 300,
            easing: 'easeOutBack'
          });
        }
      }
    }
    
    // Listen for checkbox changes
    document.addEventListener('change', (e) => {
      if (e.target.name === 'waypoint') {
        console.log('✅ 체크박스 변경 감지:', e.target.checked ? '선택됨' : '해제됨'); // 디버깅용
        updateCounter();
      }
    });
    
    // Initial state
    updateCounter();
  }

  function setupMaxSelectionLogic() {
    function updateMaxSelection() {
      const checkboxes = $$('input[name="waypoint"]');
      const checkedBoxes = $$('input[name="waypoint"]:checked');
      selectedCount = checkedBoxes.length;

      checkboxes.forEach(checkbox => {
        const item = checkbox.closest('.location-item');
        
        if (!checkbox.checked && selectedCount >= MAX_WAYPOINTS) {
          checkbox.disabled = true;
          item.style.opacity = '0.5';
          item.style.cursor = 'not-allowed';
        } else {
          checkbox.disabled = false;
          item.style.opacity = '1';
          item.style.cursor = 'pointer';
        }

        // Visual feedback for selected items
        if (checkbox.checked) {
          item.classList.add('selected-item');
        } else {
          item.classList.remove('selected-item');
        }
      });

      // Show alert if trying to select more than max
      if (selectedCount >= MAX_WAYPOINTS) {
        const unselectedItems = $$('.location-item:not(.selected-item)');
        unselectedItems.forEach(item => {
          item.addEventListener('click', showMaxSelectionAlert, { once: true });
        });
      }
    }

    // Listen for checkbox changes
    document.addEventListener('change', (e) => {
      if (e.target.name === 'waypoint') {
        updateMaxSelection();
      }
    });

    // Initial state
    updateMaxSelection();
  }

  function showMaxSelectionAlert() {
    showCustomAlert(`최대 ${MAX_WAYPOINTS}개까지만 선택 가능합니다.`);
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

  function enhancedSkipWaypoints() {
    const startCoords = $('input[name="start"]').value;
    const startName = $('input[name="startName"]').value;

    // Loading animation
    const skipBtn = $('.btn-skip');
    if (skipBtn) {
      skipBtn.disabled = true;
      skipBtn.innerHTML = `
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

    setTimeout(() => {
      const url = `/center/nav/goal?start=${encodeURIComponent(startCoords)}&startName=${encodeURIComponent(startName)}`;
      window.location.href = url;
    }, 500);
  }

  function enhancedGoToGoal() {
    const startCoords = $('input[name="start"]').value;
    const startName = $('input[name="startName"]').value;
    const selectedWaypoints = $$('input[name="waypoint"]:checked');

    // 로딩 애니메이션 (기존 코드 유지)
    const nextBtn = $('.btn-next');
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center;">
          <span style="width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></span>
          처리 중...
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

    let url = `/center/nav/goal?start=${encodeURIComponent(startCoords)}&startName=${encodeURIComponent(startName)}`;

    // 경유지가 실제로 선택된 경우에만 파라미터 추가
    if (selectedWaypoints.length > 0) {
      const waypointCoords = Array.from(selectedWaypoints).map(wp => wp.value);
      const waypointNames = Array.from(selectedWaypoints).map(wp => wp.getAttribute('data-name'));

      console.log("선택된 경유지:", waypointCoords);
      console.log("경유지 이름:", waypointNames);

      url += `&waypoints=${encodeURIComponent(waypointCoords.join('|'))}`;
      url += `&waypointNames=${encodeURIComponent(waypointNames.join('|'))}`;
    }
    // 경유지가 없으면 waypoints 파라미터 자체를 추가하지 않음

    console.log("최종 URL:", url);

    setTimeout(() => {
      window.location.href = url;
    }, 800);
  }

  function setupEnhancedCheckboxSelection() {
    // 🔧 FIX: 체크박스 상태 변경 시 완전한 정리 로직
    $$('input[name="waypoint"]').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const item = e.target.closest('.location-item');
        
        // 해제 시 모든 시각적 효과 완전 제거
        if (!e.target.checked) {
          // 즉시 모든 선택 관련 클래스 제거
          item.classList.remove('selected-item');
          checkbox.classList.remove('checkbox-checked');
          
          // DOM 업데이트를 위한 강제 리플로우
          requestAnimationFrame(() => {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.boxShadow = '';
            item.style.transform = '';
            
            checkbox.style.background = '';
            checkbox.style.borderColor = '';
            checkbox.style.boxShadow = '';
            checkbox.style.transform = '';
          });
        }
      });
    });
    
    console.log('✅ 체크박스 해제 시 완전 정리 로직 활성화');
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
    
    // 🔧 FIX: 선택 카운터 가시성 보장
    const counter = $('.selection-counter');
    if (counter) {
      counter.style.opacity = '1';
      counter.style.visibility = 'visible';
    }
  }

  function setupHeaderAnimations() {
    const header = $('.header');
    const content = $('.content');
    const counter = $('.selection-counter');
    
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
    
    if (counter && window.anime) {
      anime({
        targets: counter,
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

  function disableStartLocationWaypoints() {
    const startCoords = $('input[name="start"]')?.value;
    const startName = $('input[name="startName"]')?.value;
    
    if (!startCoords || !startName) {
      console.log('⚠️ 출발지 정보가 없습니다.');
      return;
    }
    
    console.log('🎯 출발지 좌표:', startCoords);
    console.log('🎯 출발지 이름:', startName);
    
    // 모든 경유지 체크박스 확인
    $$('input[name="waypoint"]').forEach(checkbox => {
      const waypointCoords = checkbox.value;
      const waypointName = checkbox.getAttribute('data-name');
      const item = checkbox.closest('.location-item');
      
      // 좌표가 정확히 일치하는지 확인
      if (waypointCoords === startCoords) {
        // 출발지와 동일한 위치 비활성화
        checkbox.disabled = true;
        checkbox.checked = false; // 혹시 선택되어 있다면 해제
        
        // 시각적 표시
        item.classList.add('start-location-item');
        item.style.opacity = '0.6';
        item.style.cursor = 'not-allowed';
        item.style.background = 'rgba(255, 193, 7, 0.1)'; // 노란색 배경
        item.style.borderColor = 'rgba(255, 193, 7, 0.4)';
        
        // 출발지 표시 추가
        const locationInfo = item.querySelector('.location-info');
        if (locationInfo && !locationInfo.querySelector('.start-badge')) {
          const startBadge = document.createElement('div');
          startBadge.className = 'start-badge';
          startBadge.innerHTML = '🚩 출발지';
          startBadge.style.cssText = `
            display: inline-block;
            background: linear-gradient(135deg, #ffc107, #ff8f00);
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 12px;
            margin-top: 4px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
          `;
          locationInfo.appendChild(startBadge);
        }
        
        console.log(`🚩 출발지로 설정됨: ${waypointName} (${waypointCoords})`);
        
        // 클릭 시 알림 표시
        item.addEventListener('click', (e) => {
          e.preventDefault();
          showCustomAlert('출발지로 설정된 위치는 경유지로 선택할 수 없습니다.');
        }, { once: false });
      }
    });
  }

  function init() {
    // 🔧 FIX: 즉시 레이아웃 안정화 (최우선)
    ensureLayoutStability();
    
    // 🔍 디버깅: 체크박스 개수 확인
    const allCheckboxes = $$('input[name="waypoint"]');
    console.log('🚀 초기화 시점 체크박스 개수:', allCheckboxes.length);
    allCheckboxes.forEach((checkbox, index) => {
      console.log(`📋 체크박스 ${index + 1}:`, checkbox.getAttribute('data-name'));
    });
    
    // 🚩 출발지와 동일한 경유지 비활성화
    disableStartLocationWaypoints();
    
    setupDistrictThemes();
    setupButtonRipples();
    setupLocationItemAnimations();
    setupCheckboxAnimations();
    setupSelectionCounter();
    setupMaxSelectionLogic();
    setupScrollAnimations();
    setupEnhancedCheckboxSelection();
    setupHeaderAnimations();
    
    // 🔧 FIX: 다시 한번 레이아웃 안정화
    setTimeout(() => {
      ensureLayoutStability();
    }, 50);
    
    // Make enhanced navigation functions globally available
    window.skipWaypoints = enhancedSkipWaypoints;
    window.goToGoal = enhancedGoToGoal;
    
    // Enhanced updateSelection function (override existing)
    window.updateSelection = function() {
      const checkboxes = $$('input[name="waypoint"]');
      const checkedBoxes = $$('input[name="waypoint"]:checked');
      selectedCount = checkedBoxes.length;

      // Update counter
      const counterText = $('#counterText');
      if (counterText) {
        counterText.textContent = `선택된 경유지: ${selectedCount}개 / 최대 ${MAX_WAYPOINTS}개`;
      }

      // Handle max selection logic
      checkboxes.forEach(checkbox => {
        const item = checkbox.closest('.location-item');
        
        if (!checkbox.checked && selectedCount >= MAX_WAYPOINTS) {
          checkbox.disabled = true;
          item.style.opacity = '0.5';
        } else {
          checkbox.disabled = false;
          item.style.opacity = '1';
        }

        // 🔧 FIX: 시각적 피드백 완전 제어
        if (checkbox.checked) {
          item.classList.add('selected-item');
          checkbox.classList.add('checkbox-checked');
        } else {
          // 해제 시 완전한 정리
          item.classList.remove('selected-item');
          checkbox.classList.remove('checkbox-checked');
          
          // 스타일 리셋
          requestAnimationFrame(() => {
            item.style.background = '';
            item.style.borderColor = '';
            item.style.boxShadow = '';
            item.style.transform = '';
            
            checkbox.style.background = '';
            checkbox.style.borderColor = '';
            checkbox.style.boxShadow = '';
            checkbox.style.transform = '';
          });
        }
      });
    };
    
    console.log('Center waypoints interactions initialized');
    
    // 🔍 디버깅: 전역 체크박스 테스트 함수들
    window.testCheckbox = function() {
      console.log('=== 체크박스 테스트 시작 ===');
      
      // 1. 체크박스 존재 확인
      const totalCheckboxes = $$('input[name="waypoint"]');
      console.log('총 체크박스 수:', totalCheckboxes.length);
      
      // 2. 첫 번째 체크박스 직접 선택 테스트
      const firstCheckbox = totalCheckboxes[0];
      if (firstCheckbox) {
        console.log('첫 번째 체크박스 테스트:', firstCheckbox.getAttribute('data-name'));
        firstCheckbox.checked = true;
        firstCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // 3. 선택된 체크박스 확인
      setTimeout(() => {
        const checkedBoxes = $$('input[name="waypoint"]:checked');
        console.log('선택된 체크박스 수:', checkedBoxes.length);
        console.log('=== 체크박스 테스트 완료 ===');
      }, 100);
    };
    
    window.checkWaypointStatus = function() {
      const allCheckboxes = $$('input[name="waypoint"]');
      const checkedBoxes = $$('input[name="waypoint"]:checked');
      
      console.log('=== 체크박스 상태 점검 ===');
      console.log('전체 체크박스:', allCheckboxes.length);
      console.log('선택된 체크박스:', checkedBoxes.length);
      
      allCheckboxes.forEach((checkbox, index) => {
        const hasCheckedClass = checkbox.classList.contains('checkbox-checked');
        const itemSelected = checkbox.closest('.location-item').classList.contains('selected-item');
        console.log(`${index + 1}. ${checkbox.getAttribute('data-name')}: ${checkbox.checked ? '✅ 선택됨' : '⬜ 선택안됨'} (disabled: ${checkbox.disabled}, class: ${hasCheckedClass}, item: ${itemSelected})`);
      });
      
      return {
        total: allCheckboxes.length,
        selected: checkedBoxes.length,
        checkboxes: allCheckboxes
      };
    };
    
    // 🔧 FIX: 체크박스 완전 리셋 함수 추가
    window.resetAllCheckboxes = function() {
      console.log('🗑️ 모든 체크박스 리셋 시작...');
      
      const allCheckboxes = $$('input[name="waypoint"]');
      allCheckboxes.forEach(checkbox => {
        const item = checkbox.closest('.location-item');
        
        // 체크 해제
        checkbox.checked = false;
        
        // 모든 클래스 제거
        checkbox.classList.remove('checkbox-checked');
        item.classList.remove('selected-item');
        
        // 모든 스타일 리셋
        checkbox.style.background = '';
        checkbox.style.borderColor = '';
        checkbox.style.boxShadow = '';
        checkbox.style.transform = '';
        
        item.style.background = '';
        item.style.borderColor = '';
        item.style.boxShadow = '';
        item.style.transform = '';
      });
      
      // 카운터 업데이트
      const counterText = $('#counterText');
      if (counterText) {
        counterText.textContent = `선택된 경유지: 0개 / 최대 ${MAX_WAYPOINTS}개`;
      }
      
      console.log('✅ 모든 체크박스 리셋 완료');
    };
    
    // 🔍 디버깅: 출발지 확인 함수 추가
    window.checkStartLocation = function() {
      const startCoords = $('input[name="start"]')?.value;
      const startName = $('input[name="startName"]')?.value;
      const disabledWaypoints = $$('input[name="waypoint"]:disabled');
      
      console.log('=== 출발지 정보 확인 ===');
      console.log('출발지 좌표:', startCoords);
      console.log('출발지 이름:', startName);
      console.log('비활성화된 경유지 수:', disabledWaypoints.length);
      
      disabledWaypoints.forEach((checkbox, index) => {
        const item = checkbox.closest('.location-item');
        const isStartLocation = item.classList.contains('start-location-item');
        console.log(`${index + 1}. ${checkbox.getAttribute('data-name')}: ${isStartLocation ? '🚩 출발지' : '❌ 기타 비활성화'}`);
      });
      
      return {
        startCoords,
        startName,
        disabledCount: disabledWaypoints.length
      };
    };
    
    console.log('🎮 디버깅 함수 등록됨: window.testCheckbox(), window.checkWaypointStatus(), window.resetAllCheckboxes(), window.checkStartLocation() 사용 가능');
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
