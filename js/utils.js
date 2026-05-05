// --- ユーティリティ ---

/**
 * 現在のブラウザ情報を取得する
 * @returns {Object} { name, ua, lower, keyword, isSafariMobile }
 */
function getBrowserData() {
    const ua = window.navigator.userAgent;
    const lower = ua.toLowerCase();
    let name = "";
    let keyword = "";

    // 判定ロジック
    if (lower.includes("line")) {
        name = "LINE";
        keyword = "line";
    } else if (lower.includes("edg")) {
        name = "Edge";
        keyword = "edg";
    } else if (lower.includes("chrome")) {
        name = "Chrome";
        keyword = "chrome";
    } else if (lower.includes("safari")) {
        name = "Safari";
        keyword = "safari";
    } else if (lower.includes("firefox")) {
        name = "Firefox";
        keyword = "firefox";
    } else if (lower.includes("msie") || lower.includes("trident")) {
        name = "Internet Explorer";
        keyword = lower.includes("msie") ? "msie" : "trident";
    } else {
        name = "Other";
        keyword = "";
    }

    // Safariモバイル判定 (iOSのブラウザ全般)
    const isSafariMobile =
        /iP(ad|hone|od)/i.test(ua) &&
        /Safari/i.test(ua) &&
        !/CriOS|FxiOS|EdgiOS|Line/i.test(ua);

    return { name, ua, lower, keyword, isSafariMobile };
}

function toggleFullscreen() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(`%c[Fullscreen] Action triggered. Device is mobile: ${isMobile}`, 'color: #4A90E2;');

    if (isMobile) {
        // モバイル：疑似フルスクリーン（メニューとヘルプボタンを隠す）
        const isCurrentlyPseudo = document.body.classList.toggle('is-pseudo-fullscreen');
        console.log(`%c[Fullscreen] Pseudo-fullscreen (Mobile): ${isCurrentlyPseudo ? 'ON' : 'OFF'}`, 'color: #4A90E2; font-weight: bold;');

        // レイアウト変更に合わせて再描画
        setTimeout(() => {
            if (typeof initClockFace === 'function') initClockFace();
            if (typeof refreshMenuSelection === 'function') refreshMenuSelection();
        }, 100);
    } else {
        // デスクトップ：通常のブラウザフルスクリーン
        const navContainer = document.querySelector('.nav-container');
        const helpBtn = document.getElementById('help-btn');

        if (!document.fullscreenElement) {
            console.log('%c[Fullscreen] Requesting standard fullscreen...', 'color: #4A90E2;');
            document.documentElement.requestFullscreen()
                .then(() => {
                    console.log('%c[Fullscreen] Standard fullscreen: ON', 'color: #4A90E2; font-weight: bold;');
                    // フルスクリーン時はUIを隠す
                    if (navContainer) navContainer.style.display = 'none';
                    if (helpBtn) helpBtn.style.display = 'none';
                })
                .catch(err => console.error('[Fullscreen] Error:', err));
        } else {
            console.log('%c[Fullscreen] Exiting standard fullscreen...', 'color: #4A90E2;');
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    console.log('%c[Fullscreen] Standard fullscreen: OFF', 'color: #4A90E2; font-weight: bold;');
                    // 解除時はUIを戻す
                    if (navContainer) navContainer.style.display = '';
                    if (helpBtn) helpBtn.style.display = '';
                });
            }
        }
    }
}

// ヘルプモーダルの制御
function initHelpModal() {
    const helpBtn = document.getElementById('help-btn');
    const closeBtn = document.getElementById('close-help');
    const modal = document.getElementById('help-modal');

    if (!helpBtn || !closeBtn || !modal) return;

    helpBtn.addEventListener('click', (e) => {
        console.log('%c[Modal] Opening help modal', 'color: #9387A9;');
        e.stopPropagation(); // 背景のフルスクリーン切り替えを防ぐ
        modal.style.display = 'flex';
        gsap.fromTo(modal.querySelector('.modal-content'),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    });

    closeBtn.addEventListener('click', () => {
        console.log('%c[Modal] Closing help modal', 'color: #9387A9;');
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modal.style.display = 'none';
            }
        });
    });

    // モーダルの外側をクリックしても閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}
