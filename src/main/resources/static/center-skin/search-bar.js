/* Search Bar JavaScript - Advanced Search Functionality */

/****************************
  Search Bar Class
*****************************/
class SearchBar {
    constructor(options = {}) {
        // 기본 설정
        this.options = {
            container: '.search-bar-container',
            input: '#searchInput',
            clearBtn: '#clearBtn',
            searchBtn: '#searchBtn',
            resultsContainer: '#searchResults',
            recentContainer: '#recentSearches',
            recentList: '#recentList',
            clearRecentBtn: '#clearRecentBtn',
            debounceDelay: 300,
            maxRecentItems: 5,
            minSearchLength: 1,
            maxResults: 10,
            storageKey: 'centerSearchHistory',
            // API 설정
            apiUrl: '/api/v1/location/search',
            apiTimeout: 5000,
            enableFallback: true,
            ...options
        };

        // DOM 요소 캐싱
        this.elements = {};
        this.cacheElements();

        // 상태 관리
        this.state = {
            isSearching: false,
            currentQuery: '',
            selectedIndex: -1,
            filteredResults: [],
            recentSearches: this.loadRecentSearches()
        };

        // 데이터 (전역 locations 배열 사용)
        this.locations = window.locations || [];

        // 이벤트 리스너 등록
        this.bindEvents();

        // 초기화
        this.init();
    }

    /****************************
      DOM 요소 캐싱
    *****************************/
    cacheElements() {
        try {
            this.elements = {
                container: document.querySelector(this.options.container),
                input: document.querySelector(this.options.input),
                clearBtn: document.querySelector(this.options.clearBtn),
                searchBtn: document.querySelector(this.options.searchBtn),
                resultsContainer: document.querySelector(this.options.resultsContainer),
                recentContainer: document.querySelector(this.options.recentContainer),
                recentList: document.querySelector(this.options.recentList),
                clearRecentBtn: document.querySelector(this.options.clearRecentBtn),
            };
        } catch (error) {
            console.error('검색바 요소를 찾을 수 없습니다:', error);
        }
    }

    /****************************
      초기화
    *****************************/
    init() {
        // 최근 검색어 표시
        this.renderRecentSearches();


        // 접근성 설정
        this.setupAccessibility();

        console.log('검색바가 초기화되었습니다.');
    }

    /****************************
      이벤트 리스너 등록
    *****************************/
    bindEvents() {
        if (!this.elements.input) return;

        // 검색 입력 이벤트 (디바운싱)
        let searchTimeout;
        this.elements.input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            // 지우기 버튼 표시/숨김
            this.toggleClearButton(query.length > 0);
            
            searchTimeout = setTimeout(() => {
                this.handleSearch(query);
            }, this.options.debounceDelay);
        });

        // 검색 입력 포커스 이벤트
        this.elements.input.addEventListener('focus', () => {
            const query = this.elements.input.value.trim();
            if (query.length === 0) {
                this.showRecentSearches();
            }
        });

        // 검색 입력 블러 이벤트 (지연 처리)
        this.elements.input.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideResults();
                this.hideRecentSearches();
            }, 200);
        });

        // 키보드 네비게이션
        this.elements.input.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // 지우기 버튼 클릭
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // 검색 버튼 클릭
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => {
                this.executeSearch();
            });
        }

        // 최근 검색어 지우기
        if (this.elements.clearRecentBtn) {
            this.elements.clearRecentBtn.addEventListener('click', () => {
                this.clearRecentSearches();
            });
        }


        // 외부 클릭 시 결과 숨김
        document.addEventListener('click', (e) => {
            if (!this.elements.container.contains(e.target)) {
                this.hideResults();
                this.hideRecentSearches();
            }
        });

        // 창 크기 변경 시 결과 위치 조정 (필요시)
        window.addEventListener('resize', this.debounce(() => {
            // CSS로 자동 정렬되므로 추가 작업 불필요
        }, 100));
    }

    /****************************
      검색 처리
    *****************************/
    async handleSearch(query) {
        this.state.currentQuery = query;
        this.state.selectedIndex = -1;

        if (query.length < this.options.minSearchLength) {
            this.hideResults();
            if (query.length === 0) {
                this.showRecentSearches();
            }
            return;
        }

        this.hideRecentSearches();
        this.showLoading();

        try {
            // 검색 실행
            const results = await this.performSearch(query);
            this.state.filteredResults = results;
            
            // 결과 표시
            this.renderResults(results);
            
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            this.showError('검색 중 오류가 발생했습니다.');
        }
    }

    /****************************
      검색 실행
    *****************************/
    async performSearch(query) {
        try {
            // AbortController로 타임아웃 처리
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.options.apiTimeout);

            // 백엔드 API 호출
            const response = await fetch(`${this.options.apiUrl}?q=${encodeURIComponent(query)}&limit=${this.options.maxResults}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // API 응답 데이터를 프론트엔드 형식으로 변환
            const results = data.map(item => ({
                id: item.id || item.locationId,
                name: item.name || item.locationName?.locationName || item.locationName,
                address: item.address || item.locationAddress?.address || item.locationAddress,
                tel: item.tel || item.locationNumber?.locationNumber || item.locationNumber,
                lat: item.lat || item.latitude?.latitude || item.latitude,
                lng: item.lng || item.longitude?.longitude || item.longitude
            }));

            return results;
        } catch (error) {
            console.error('검색 API 호출 실패:', error);
            
            // 폴백이 활성화된 경우에만 클라이언트 사이드 검색 실행
            if (this.options.enableFallback) {
                console.warn('클라이언트 사이드 검색으로 폴백합니다.');
                return this.performClientSideSearch(query);
            } else {
                // 폴백이 비활성화된 경우 빈 결과 반환
                throw error;
            }
        }
    }

    /****************************
      클라이언트 사이드 검색 (폴백용)
    *****************************/
    performClientSideSearch(query) {
        const results = this.locations.filter(location => {
            const searchText = `${location.name} ${location.address}`.toLowerCase();
            const queryLower = query.toLowerCase();
            
            // 기본 텍스트 매칭
            let matches = searchText.includes(queryLower);
            
            return matches;
        }).slice(0, this.options.maxResults);

        // 관련성에 따른 정렬
        results.sort((a, b) => {
            const aRelevance = this.calculateRelevance(a, query);
            const bRelevance = this.calculateRelevance(b, query);
            return bRelevance - aRelevance;
        });

        return results;
    }

    /****************************
      관련성 점수 계산
    *****************************/
    calculateRelevance(location, query) {
        const queryLower = query.toLowerCase();
        const nameLower = (location.name || '').toLowerCase();
        const addressLower = (location.address || '').toLowerCase();
        
        let score = 0;
        
        // 이름 완전 일치
        if (nameLower === queryLower) score += 100;
        // 이름 시작 일치
        else if (nameLower.startsWith(queryLower)) score += 80;
        // 이름 포함
        else if (nameLower.includes(queryLower)) score += 60;
        
        // 주소 포함
        if (addressLower.includes(queryLower)) score += 40;
        
        // 길이 보너스 (짧을수록 높은 점수)
        score += Math.max(0, 20 - nameLower.length);
        
        return score;
    }

    /****************************
      결과 렌더링
    *****************************/
    renderResults(results) {
        if (!this.elements.resultsContainer) return;

        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        const html = results.map((location, index) => {
            const district = this.getDistrict(location.address);
            const iconClass = this.getDistrictIconClass(district);
            
            return `
                <div class="search-result-item" data-index="${index}" data-id="${location.id}" role="option">
                    <div class="result-icon ${iconClass}">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                    <div class="result-content">
                        <div class="result-name">${this.highlightText(location.name || '', this.state.currentQuery)}</div>
                        <div class="result-address">${this.highlightText(location.address || '', this.state.currentQuery)}</div>
                    </div>
                    ${location.distance ? `<div class="result-distance">${location.distance}</div>` : ''}
                </div>
            `;
        }).join('');

        this.elements.resultsContainer.innerHTML = html;
        this.showResults();
        this.bindResultEvents();
    }

    /****************************
      결과 이벤트 바인딩
    *****************************/
    bindResultEvents() {
        const items = this.elements.resultsContainer.querySelectorAll('.search-result-item');
        
        items.forEach((item, index) => {
            // 클릭 이벤트
            item.addEventListener('click', () => {
                this.selectResult(index);
            });

            // 마우스 이벤트
            item.addEventListener('mouseenter', () => {
                this.highlightResult(index);
            });

            // 리플 효과
            item.addEventListener('click', (e) => {
                this.createRipple(e, item);
            });
        });
    }

    /****************************
      키보드 네비게이션
    *****************************/
    handleKeyNavigation(e) {
        const results = this.elements.resultsContainer.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.state.selectedIndex = Math.min(this.state.selectedIndex + 1, results.length - 1);
                this.updateHighlight();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.state.selectedIndex = Math.max(this.state.selectedIndex - 1, -1);
                this.updateHighlight();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.state.selectedIndex >= 0) {
                    this.selectResult(this.state.selectedIndex);
                } else {
                    this.executeSearch();
                }
                break;
                
            case 'Escape':
                this.hideResults();
                this.hideRecentSearches();
                this.elements.input.blur();
                break;
        }
    }

    /****************************
      결과 선택
    *****************************/
    selectResult(index) {
        const result = this.state.filteredResults[index];
        if (!result) return;

        // 검색어 저장
        this.addToRecentSearches(result.name);

        // 선택된 결과 처리
        this.handleResultSelection(result);

        // UI 정리
        this.elements.input.value = result.name;
        this.hideResults();
        this.hideRecentSearches();
        this.elements.input.blur();
    }

    /****************************
      결과 선택 처리 (커스터마이징 가능)
    *****************************/
    handleResultSelection(result) {
        // 지도에서 해당 위치로 이동
        if (window.naverMap && result.lat && result.lng) {
            const position = new naver.maps.LatLng(result.lat, result.lng);
            window.naverMap.panTo(position, {
                duration: 500,
                easing: 'easeOutQuad'
            });
            window.naverMap.setZoom(16);

            // 정보창 표시
            if (window.mapInfoWindow) {
                const theme = this.getAreaTheme(result.address);
                const html = this.createInfoWindowHTML(result, theme);
                window.mapInfoWindow.setContent(html);
                window.mapInfoWindow.open(window.naverMap, 
                    window.mapMarkers?.find(marker => 
                        marker.getTitle() === result.name
                    )
                );
            }
        }

        // 커스텀 이벤트 발생
        this.dispatchCustomEvent('search:result-selected', { result });
        
        console.log('선택된 결과:', result);
    }

    /****************************
      최근 검색어 관리
    *****************************/
    loadRecentSearches() {
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('최근 검색어 로드 실패:', error);
            return [];
        }
    }

    addToRecentSearches(query) {
        if (!query || query.trim().length === 0) return;

        const trimmedQuery = query.trim();
        
        // 중복 제거
        this.state.recentSearches = this.state.recentSearches.filter(item => item !== trimmedQuery);
        
        // 맨 앞에 추가
        this.state.recentSearches.unshift(trimmedQuery);
        
        // 최대 개수 제한
        this.state.recentSearches = this.state.recentSearches.slice(0, this.options.maxRecentItems);
        
        // 저장
        this.saveRecentSearches();
        this.renderRecentSearches();
    }

    saveRecentSearches() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.state.recentSearches));
        } catch (error) {
            console.warn('최근 검색어 저장 실패:', error);
        }
    }

    clearRecentSearches() {
        this.state.recentSearches = [];
        this.saveRecentSearches();
        this.renderRecentSearches();
        this.hideRecentSearches();
    }

    renderRecentSearches() {
        if (!this.elements.recentList || this.state.recentSearches.length === 0) return;

        const html = this.state.recentSearches.map(query => `
            <div class="recent-item" data-query="${this.escapeHtml(query)}">
                ${this.escapeHtml(query)}
            </div>
        `).join('');

        this.elements.recentList.innerHTML = html;

        // 이벤트 바인딩
        this.elements.recentList.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                this.elements.input.value = query;
                this.handleSearch(query);
                this.hideRecentSearches();
            });
        });
    }


    /****************************
      UI 상태 관리
    *****************************/
    showResults() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'block';
            this.elements.resultsContainer.setAttribute('aria-hidden', 'false');
        }
    }

    hideResults() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'none';
            this.elements.resultsContainer.setAttribute('aria-hidden', 'true');
        }
        this.state.selectedIndex = -1;
    }

    showRecentSearches() {
        if (this.elements.recentContainer && this.state.recentSearches.length > 0) {
            this.elements.recentContainer.style.display = 'block';
        }
    }

    hideRecentSearches() {
        if (this.elements.recentContainer) {
            this.elements.recentContainer.style.display = 'none';
        }
    }

    showLoading() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.innerHTML = `
                <div class="search-loading">
                    <div class="search-spinner"></div>
                    <span>검색 중...</span>
                </div>
            `;
            this.showResults();
        }
    }

    showNoResults() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">검색 결과가 없습니다</div>
                    <div class="no-results-hint">다른 키워드로 검색해보세요</div>
                </div>
            `;
            this.showResults();
        }
    }

    showError(message) {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">⚠️</div>
                    <div class="no-results-text">${this.escapeHtml(message)}</div>
                </div>
            `;
            this.showResults();
        }
    }

    toggleClearButton(show) {
        if (this.elements.clearBtn) {
            this.elements.clearBtn.style.display = show ? 'flex' : 'none';
        }
    }

    clearSearch() {
        this.elements.input.value = '';
        this.elements.input.focus();
        this.toggleClearButton(false);
        this.hideResults();
        this.showRecentSearches();
        this.state.currentQuery = '';
        this.state.selectedIndex = -1;
    }

    executeSearch() {
        const query = this.elements.input.value.trim();
        if (query) {
            this.addToRecentSearches(query);
            this.handleSearch(query);
        }
    }

    highlightResult(index) {
        const items = this.elements.resultsContainer.querySelectorAll('.search-result-item');
        items.forEach((item, i) => {
            item.classList.toggle('highlighted', i === index);
        });
        this.state.selectedIndex = index;
    }

    updateHighlight() {
        this.highlightResult(this.state.selectedIndex);
        
        // 스크롤 조정
        const highlighted = this.elements.resultsContainer.querySelector('.highlighted');
        if (highlighted) {
            highlighted.scrollIntoView({ block: 'nearest' });
        }
    }

    /****************************
      유틸리티 함수
    *****************************/
    getDistrict(address) {
        if (!address) return 'default';
        if (address.includes('수정구')) return 'sujeong';
        if (address.includes('분당구')) return 'bundang';
        if (address.includes('중원구')) return 'jungwon';
        return 'default';
    }

    getDistrictIconClass(district) {
        return `result-icon-${district}`;
    }

    getAreaTheme(address) {
        const addr = (address || '').toString();
        if (addr.includes('수정구')) return { gradient: 'linear-gradient(135deg, #DD164B 0%, #FF6B8A 100%)', accent: '#DD164B' };
        if (addr.includes('분당구')) return { gradient: 'linear-gradient(135deg, #0175C0 0%, #49A7F2 100%)', accent: '#0175C0' };
        if (addr.includes('중원구')) return { gradient: 'linear-gradient(135deg, #F8AC59 0%, #FFC98A 100%)', accent: '#F8AC59' };
        return { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' };
    }

    highlightText(text, query) {
        if (!query || !text) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    createInfoWindowHTML(result, theme) {
        return `
            <div style="min-width: 200px; max-width: 280px; padding: 16px; font-family: 'Noto Sans KR', sans-serif; line-height: 1.5;">
                <div style="font-weight: 700; font-size: 16px; color: #2d3748; margin-bottom: 8px; border-bottom: 2px solid ${theme.accent}; padding-bottom: 6px;">
                    ${result.name || ''}
                </div>
                <div style="font-size: 13px; color: #4a5568; margin-bottom: 6px; display: flex; align-items: flex-start;">
                    <svg width="14" height="14" style="margin-right: 6px; margin-top: 2px; flex-shrink: 0;" fill="${theme.accent}" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>${result.address || ''}</span>
                </div>
                ${result.tel ? `
                <div style="font-size: 13px; color: ${theme.accent}; font-weight: 500; display: flex; align-items: center;">
                    <svg width="14" height="14" style="margin-right: 6px;" fill="${theme.accent}" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <a href="tel:${result.tel}" style="color: inherit; text-decoration: none;">${result.tel}</a>
                </div>
                ` : ''}
            </div>
        `;
    }

    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.className = 'ripple';
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        element.appendChild(ripple);

        // 애니메이션 실행
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            ripple.remove();
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.elements.container.dispatchEvent(event);
    }

    setupAccessibility() {
        if (this.elements.input) {
            this.elements.input.setAttribute('role', 'combobox');
            this.elements.input.setAttribute('aria-expanded', 'false');
            this.elements.input.setAttribute('aria-autocomplete', 'list');
        }

        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.setAttribute('role', 'listbox');
            this.elements.resultsContainer.setAttribute('aria-hidden', 'true');
        }
    }

    adjustResultsPosition() {
        // position: absolute이므로 CSS에서 자동으로 중앙 정렬됨
        // 추가 조정이 필요한 경우에만 사용
    }
    
    adjustRecentSearchesPosition() {
        // position: absolute이므로 CSS에서 자동으로 중앙 정렬됨
        // 추가 조정이 필요한 경우에만 사용
    }

    /****************************
      공개 API
    *****************************/
    search(query) {
        this.elements.input.value = query;
        this.handleSearch(query);
    }

    clear() {
        this.clearSearch();
    }

    // API URL 설정
    setApiUrl(url) {
        this.options.apiUrl = url;
    }

    // API 설정 업데이트
    updateApiConfig(config) {
        Object.assign(this.options, config);
    }

    // 현재 설정 조회
    getConfig() {
        return { ...this.options };
    }

    destroy() {
        // 이벤트 리스너 제거 및 정리
        this.elements.input?.removeEventListener('input', this.handleSearch);
        // ... 기타 정리 작업
    }
}

/****************************
  자동 초기화
*****************************/
document.addEventListener('DOMContentLoaded', () => {
    // 검색바가 존재하는 경우에만 초기화
    if (document.querySelector('.search-bar-container')) {
        window.searchBar = new SearchBar();
        
        console.log('검색바가 자동으로 초기화되었습니다.');
    }
});

// 전역 접근을 위한 export
window.SearchBar = SearchBar;
