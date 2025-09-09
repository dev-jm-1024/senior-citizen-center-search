/* Center Nav Result - Navigation Result Display JavaScript */

(function() {
  'use strict';

  /****************************
    Utility Functions
  *****************************/
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  /****************************
    Button Ripple Effects
  *****************************/
  function setupButtonRipples() {
    $$('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!btn.disabled && !btn.classList.contains('disabled')) {
          const ripple = document.createElement('div');
          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.classList.add('ripple');
          ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
          `;

          btn.appendChild(ripple);

          if (window.anime) {
            anime({
              targets: ripple,
              scale: [0, 1],
              opacity: [1, 0],
              duration: 600,
              easing: 'easeOutQuart',
              complete: () => ripple.remove()
            });
          } else {
            setTimeout(() => ripple.remove(), 600);
          }
        }
      });
    });
  }

  /****************************
    Enhanced Animations
  *****************************/
  function setupResultAnimations() {
    // Path items 순차적 애니메이션
    $$('.path-item').forEach((item, index) => {
      if (window.anime) {
        anime({
          targets: item,
          translateX: [-30, 0],
          opacity: [0, 1],
          duration: 600,
          delay: 600 + (index * 100),
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
            scale: [1, 1.01],
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

    // Direction items 애니메이션
    $$('.direction-item').forEach((item, index) => {
      if (window.anime) {
        anime({
          targets: item,
          translateX: [-20, 0],
          opacity: [0, 1],
          duration: 400,
          delay: 800 + (index * 50),
          easing: 'easeOutQuad'
        });
      }
    });

    // Directions container 스크롤 애니메이션
    const directionsContainer = $('.directions-container');
    if (directionsContainer && window.anime) {
      anime({
        targets: directionsContainer,
        opacity: [0, 1],
        scale: [0.98, 1],
        duration: 600,
        delay: 1000,
        easing: 'easeOutQuart'
      });
    }
  }

  /****************************
    Header Animations
  *****************************/
  function setupHeaderAnimations() {
    const header = $('.header');
    if (!header) return;

    // Header hover effect
    header.addEventListener('mouseenter', () => {
      if (window.anime) {
        anime({
          targets: header,
          translateY: [0, -1],
          scale: [1, 1.005],
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    });

    header.addEventListener('mouseleave', () => {
      if (window.anime) {
        anime({
          targets: header,
          translateY: 0,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    });
  }

  /****************************
    Scroll Animations
  *****************************/
  function setupScrollAnimations() {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (window.anime) {
            anime({
              targets: target,
              translateY: [20, 0],
              opacity: [0, 1],
              duration: 600,
              easing: 'easeOutQuad'
            });
          }
          
          observer.unobserve(target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements that need scroll animations
    $$('.route-summary, .directions').forEach(el => {
      observer.observe(el);
    });
  }

  /****************************
    Map Enhancements
  *****************************/
  function setupMapEnhancements() {
    const mapContainer = $('#map');
    if (!mapContainer) return;

    // Map loading animation
    if (window.anime) {
      anime({
        targets: mapContainer,
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 800,
        delay: 1000,
        easing: 'easeOutQuart'
      });
    }
  }

  /****************************
    Enhanced Button Interactions
  *****************************/
  function setupButtonInteractions() {
    const newSearchBtn = $('.btn-new-search');
    if (!newSearchBtn) return;

    // Button loading state simulation
    newSearchBtn.addEventListener('click', (e) => {
      const originalText = newSearchBtn.innerHTML;
      newSearchBtn.innerHTML = '🔄 처리중...';
      newSearchBtn.disabled = true;

      // Simulate loading for better UX
      setTimeout(() => {
        // The actual navigation will happen before this, but just in case
        newSearchBtn.innerHTML = originalText;
        newSearchBtn.disabled = false;
      }, 2000);
    });

    // Enhanced hover animation
    newSearchBtn.addEventListener('mouseenter', () => {
      if (window.anime) {
        anime({
          targets: newSearchBtn,
          translateY: [0, -2],
          scale: [1, 1.02],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    });

    newSearchBtn.addEventListener('mouseleave', () => {
      if (window.anime) {
        anime({
          targets: newSearchBtn,
          translateY: 0,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    });
  }

  /****************************
    Layout Stability
  *****************************/
  function ensureLayoutStability() {
    // Force immediate visibility for critical elements
    const criticalElements = [
      '.header', '.content-grid', '.route-info', '.map-container',
      '.btn', '.path-item', '.route-summary'
    ];

    criticalElements.forEach(selector => {
      $$(selector).forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
        }
      });
    });

    // Prevent horizontal overflow
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';

    // Ensure container layout stability
    const container = $('.container');
    if (container) {
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      container.style.transform = 'translateY(0)';
    }

    // Button visibility reinforcement
    const buttons = $$('.btn');
    buttons.forEach(btn => {
      if (btn) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
        btn.style.display = 'inline-flex';
        btn.style.transform = 'translateY(0)';
      }
    });

    // Map container stability
    const mapContainer = $('.map-container');
    if (mapContainer) {
      mapContainer.style.opacity = '1';
      mapContainer.style.visibility = 'visible';
      mapContainer.style.transform = 'translateY(0)';
    }
  }

  /****************************
    Show Custom Alert
  *****************************/
  function showCustomAlert(message) {
    // Create custom alert overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    `;

    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
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
    if (window.anime) {
      anime({
        targets: alertBox,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
      });
    }
  }

  /****************************
    Map Integration & Naver Maps Setup
  *****************************/
  function initializeNaverMap() {
    // Wait for Naver Maps API to load
    const checkNaverMaps = setInterval(() => {
      if (window.naver && window.naver.maps) {
        clearInterval(checkNaverMaps);
        setupNaverMap();
      }
    }, 100);

    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkNaverMaps);
    }, 10000);
  }

  function setupNaverMap() {
    // Get Thymeleaf data from meta tags or global variables
    const startCoords = window.mapData?.start || '127.0000,37.0000';
    const goalCoords = window.mapData?.goal || '127.0000,37.0000';
    const waypointsStr = window.mapData?.waypoints || null;
    const pathCoords = window.mapData?.pathCoords || null;
    const startName = window.mapData?.startName || '출발지';
    const goalName = window.mapData?.goalName || '도착지';
    const waypointNames = window.mapData?.waypointNames || '';

    console.log("시작 좌표:", startCoords);
    console.log("도착 좌표:", goalCoords);
    console.log("경유지:", waypointsStr);
    console.log("Path 데이터:", pathCoords);

    // Parse coordinates
    const startLatLng = startCoords.split(',');
    const goalLatLng = goalCoords.split(',');

    // Initialize map centered on start location
    const mapOptions = {
      center: new naver.maps.LatLng(parseFloat(startLatLng[1]), parseFloat(startLatLng[0])), // lat, lng order
      zoom: 12,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.BUTTON,
        position: naver.maps.Position.TOP_RIGHT
      },
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_LEFT
      }
    };

    const map = new naver.maps.Map('map', mapOptions);

    // Start marker
    const startMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(parseFloat(startLatLng[1]), parseFloat(startLatLng[0])),
      map: map,
      title: startName,
      icon: {
        content: '<div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;">🚀 출발</div>',
        anchor: new naver.maps.Point(30, 20)
      }
    });

    // Goal marker
    const goalMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(parseFloat(goalLatLng[1]), parseFloat(goalLatLng[0])),
      map: map,
      title: goalName,
      icon: {
        content: '<div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;">🎯 도착</div>',
        anchor: new naver.maps.Point(30, 20)
      }
    });

    // Bounds for auto-fitting map view
    const bounds = new naver.maps.LatLngBounds();
    bounds.extend(new naver.maps.LatLng(parseFloat(startLatLng[1]), parseFloat(startLatLng[0])));
    bounds.extend(new naver.maps.LatLng(parseFloat(goalLatLng[1]), parseFloat(goalLatLng[0])));

    // Waypoint markers (if any)
    if (waypointsStr && waypointsStr !== 'null' && waypointsStr.trim() !== '') {
      const waypoints = waypointsStr.split('|');
      const waypointNameArray = waypointNames ? waypointNames.split('|') : [];

      waypoints.forEach((waypoint, index) => {
        const coords = waypoint.split(',');
        const lat = parseFloat(coords[1]);
        const lng = parseFloat(coords[0]);

        if (!isNaN(lat) && !isNaN(lng)) {
          const waypointMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: map,
            title: waypointNameArray[index] || ('경유지 ' + (index + 1)),
            icon: {
              content: `<div style="background: linear-gradient(135deg, #fd7e14, #e55a4e); color: white; padding: 4px 8px; border-radius: 16px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white;">${index + 1}</div>`,
              anchor: new naver.maps.Point(15, 15)
            }
          });

          bounds.extend(new naver.maps.LatLng(lat, lng));
        }
      });
    }

    // ===== Draw actual route line =====
    if (pathCoords && Array.isArray(pathCoords) && pathCoords.length > 0) {
      console.log("실제 경로 데이터로 라인 그리기. 좌표 개수:", pathCoords.length);

      // Convert coordinates (lng,lat → lat,lng)
      const polylinePath = pathCoords.map(coord => {
        if (Array.isArray(coord) && coord.length >= 2) {
          return new naver.maps.LatLng(coord[1], coord[0]); // lat, lng order
        }
      }).filter(coord => coord !== undefined);

      if (polylinePath.length > 0) {
        // Create actual route polyline
        const routePolyline = new naver.maps.Polyline({
          map: map,
          path: polylinePath,
          strokeColor: '#28a745',
          strokeWeight: 6,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        });

        console.log("실제 경로 라인 생성 완료");

        // Include route line in bounds
        polylinePath.forEach(coord => {
          bounds.extend(coord);
        });
      }
    } else {
      console.log("Path 데이터가 없어서 간단한 직선 경로 그리기");

      // Simple straight line if no path data
      const simplePath = [
        new naver.maps.LatLng(parseFloat(startLatLng[1]), parseFloat(startLatLng[0]))
      ];

      // Add waypoints
      if (waypointsStr && waypointsStr !== 'null' && waypointsStr.trim() !== '') {
        const waypoints = waypointsStr.split('|');
        waypoints.forEach(waypoint => {
          const coords = waypoint.split(',');
          const lat = parseFloat(coords[1]);
          const lng = parseFloat(coords[0]);
          if (!isNaN(lat) && !isNaN(lng)) {
            simplePath.push(new naver.maps.LatLng(lat, lng));
          }
        });
      }

      // Add goal
      simplePath.push(new naver.maps.LatLng(parseFloat(goalLatLng[1]), parseFloat(goalLatLng[0])));

      // Simple straight route (dashed line)
      const simplePolyline = new naver.maps.Polyline({
        map: map,
        path: simplePath,
        strokeColor: '#28a745',
        strokeWeight: 4,
        strokeOpacity: 0.7,
        strokeStyle: 'dashed'
      });

      console.log("간단한 직선 경로 라인 생성 완료");
    }

    // Auto-fit map bounds
    setTimeout(() => {
      map.fitBounds(bounds, {top: 50, right: 50, bottom: 50, left: 50});
    }, 300);

    // Info windows for markers
    const startInfoWindow = new naver.maps.InfoWindow({
      content: `<div style="padding: 12px; font-size: 14px; max-width: 200px;"><strong>${startName}</strong><br><small>좌표: ${startCoords}</small></div>`
    });

    const goalInfoWindow = new naver.maps.InfoWindow({
      content: `<div style="padding: 12px; font-size: 14px; max-width: 200px;"><strong>${goalName}</strong><br><small>좌표: ${goalCoords}</small></div>`
    });

    // Marker click events
    naver.maps.Event.addListener(startMarker, 'click', () => {
      if (startInfoWindow.getMap()) {
        startInfoWindow.close();
      } else {
        startInfoWindow.open(map, startMarker);
      }
    });

    naver.maps.Event.addListener(goalMarker, 'click', () => {
      if (goalInfoWindow.getMap()) {
        goalInfoWindow.close();
      } else {
        goalInfoWindow.open(map, goalMarker);
      }
    });

    // Map load animation
    const mapElement = $('#map');
    if (mapElement && window.anime) {
      anime({
        targets: mapElement,
        opacity: [0.8, 1],
        scale: [0.98, 1],
        duration: 600,
        easing: 'easeOutQuart'
      });
    }
  }

  function enhanceMapIntegration() {
    initializeNaverMap();
  }

  /****************************
    Initialize All Functions
  *****************************/
  function init() {
    // 🔧 FIX: 즉시 레이아웃 안정화 (최우선)
    ensureLayoutStability();

    // Setup core functionality
    setupButtonRipples();
    setupResultAnimations();
    setupHeaderAnimations();
    setupScrollAnimations();
    setupMapEnhancements();
    setupButtonInteractions();
    enhanceMapIntegration();

    // 🔧 FIX: 다시 한번 레이아웃 안정화
    setTimeout(() => {
      ensureLayoutStability();
    }, 50);

    console.log('Center Nav Result 페이지 초기화 완료');
  }

  /****************************
    DOM Ready & Error Handling
  *****************************/
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global error handling
  window.addEventListener('error', (e) => {
    console.warn('Center Nav Result JS Error:', e.error);
  });

  // Expose utility functions globally if needed
  window.showCustomAlert = showCustomAlert;

})();
