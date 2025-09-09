// 센터 삭제 기능을 위한 JavaScript

// 커스텀 알림/확인 모달 HTML과 스타일 동적 생성
function ensureModalStyles() {
    if (document.getElementById('center-delete-styles')) return;
    const modalStyle = `
        <style id="center-delete-styles">
        .custom-alert { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.45); display: none; justify-content: center; align-items: center; z-index: 10000; }
        .custom-alert-content { background: #ffffff; padding: 24px; border-radius: 12px; text-align: center; max-width: 420px; width: 92%; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
        .custom-alert h3 { margin: 0 0 12px 0; font-size: 18px; color: #333; font-weight: 800; }
        .custom-alert p { margin: 0 0 16px 0; color: #555; line-height: 1.55; }
        .custom-alert .btn-row { display: flex; gap: 8px; justify-content: center; margin-top: 10px; }
        .custom-alert button { background: linear-gradient(135deg, #38bdf8, #2563eb); color: #fff; border: none; padding: 10px 16px; border-radius: 9999px; cursor: pointer; font-size: 14px; font-weight: 700; }
        .custom-alert button:hover { filter: brightness(1.05); }
        .custom-alert .btn-cancel { background: linear-gradient(135deg, #9ca3af, #6b7280); }
        .custom-alert.success h3 { color: #28a745; }
        .custom-alert.error h3 { color: #dc3545; }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', modalStyle);
}

function createAlertModal() {
    ensureModalStyles();
    if (document.getElementById('customAlert')) return;
    const modalHTML = `
        <div id="customAlert" class="custom-alert">
            <div class="custom-alert-content">
                <h3 id="alertTitle"></h3>
                <p id="alertMessage"></p>
                <button onclick="closeAlert()" id="alertButton">확인</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function createConfirmModal() {
    ensureModalStyles();
    if (document.getElementById('customConfirm')) return;
    const confirmHTML = `
        <div id="customConfirm" class="custom-alert confirm">
            <div class="custom-alert-content">
                <h3 id="confirmTitle">삭제 확인</h3>
                <p id="confirmMessage">정말로 삭제하시겠습니까?</p>
                <div class="btn-row">
                    <button id="confirmCancelBtn" type="button" class="btn-cancel">취소</button>
                    <button id="confirmOkBtn" type="button">삭제</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', confirmHTML);
}

// 알림 모달 표시 함수
function showAlert(type, title, message, callback) {
    createAlertModal(); // 모달이 없으면 생성

    const alertModal = document.getElementById('customAlert');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');

    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertModal.className = 'custom-alert ' + type;
    alertModal.style.display = 'flex';

    // 콜백 함수가 있으면 저장
    alertModal.callback = callback;
}

// 알림 모달 닫기 함수
function closeAlert() {
    const alertModal = document.getElementById('customAlert');
    alertModal.style.display = 'none';

    // 콜백 함수가 있으면 실행
    if (alertModal.callback) {
        alertModal.callback();
        alertModal.callback = null;
    }
}

// 확인 모달 표시 함수
function showConfirm(title, message, onConfirm) {
    createConfirmModal();
    const confirmModal = document.getElementById('customConfirm');
    document.getElementById('confirmTitle').textContent = title || '확인';
    document.getElementById('confirmMessage').textContent = message || '';
    confirmModal.style.display = 'flex';
    const okBtn = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');
    okBtn.onclick = function () { try { onConfirm && onConfirm(); } finally { closeConfirm(); } };
    cancelBtn.onclick = function () { closeConfirm(); };
}

function closeConfirm() {
    const confirmModal = document.getElementById('customConfirm');
    if (confirmModal) confirmModal.style.display = 'none';
}

// 센터 삭제 함수
function deleteCenter(locationId) {
    showConfirm('삭제 확인', '정말로 이 경로당을 삭제하시겠습니까?', function () {
        const formData = new FormData();
        fetch(`/api/v1/location/${locationId}/change/status`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    function getRedirectUrl() {
                        try {
                            const ref = document.referrer;
                            const sameOrigin = ref && new URL(ref, location.origin).origin === location.origin;
                            if (sameOrigin && /(center\/main|center\/view\/quarter)/.test(ref)) {
                                return ref;
                            }
                        } catch (e) {}
                        return '/center/main';
                    }
                    const redirectTo = getRedirectUrl();
                    showAlert('success', '삭제 완료', '경로당이 성공적으로 삭제되었습니다.', function() {
                        window.location.href = redirectTo;
                    });
                    setTimeout(() => { try { closeAlert(); } catch(e) {} }, 1000);
                } else {
                    showAlert('error', '삭제 실패', '경로당 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('error', '네트워크 오류', '서버와의 통신 중 오류가 발생했습니다. 다시 시도해 주세요.');
            });
    });
}

// 페이지 로드 시 삭제 버튼에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const deleteForm = document.querySelector('form[action*="/change/status"]');

    if (deleteForm) {
        // 기존 form submit 이벤트 방지하고 커스텀 함수 실행
        deleteForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 기본 form 제출 방지

            // URL에서 locationId 추출
            const actionUrl = this.action;
            const locationId = actionUrl.match(/\/location\/(\d+)\/change\/status/)[1];

            deleteCenter(locationId);
        });
    }
});