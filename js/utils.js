// --- ユーティリティ ---

// 時間形式 (true: 24時間, false: 12時間)
window.is24HourFormat = true;

// 時間ソース (true: オンライン, false: 内蔵)
window.isOnlineTime = false;
window.timeOffset = 0; // ミリ秒単位のオフセット

/**
 * トースト通知を表示する
 * @param {string} message 表示するメッセージ
 * @param {Object} highlight オプション：色付けするテキストと色の指定 { text, color }
 */
function showToast(message, highlight = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 同時に表示するトーストを最大2個に制限
    const currentToasts = container.getElementsByClassName('toast');
    if (currentToasts.length >= 2) {
        const oldest = currentToasts[0];
        oldest.classList.remove('show');
        setTimeout(() => {
            if (oldest.parentNode === container) container.removeChild(oldest);
        }, 300);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    if (highlight && highlight.text && highlight.color) {
        // 特定のテキストを色付けする
        const parts = message.split(highlight.text);
        const span = document.createElement('span');
        span.textContent = highlight.text;
        span.style.color = highlight.color;
        span.style.textShadow = `0 0 10px ${highlight.color}44`; // ほのかな光彩
        
        toast.appendChild(document.createTextNode(parts[0]));
        toast.appendChild(span);
        if (parts[1]) toast.appendChild(document.createTextNode(parts[1]));
    } else {
        toast.textContent = message;
    }

    container.appendChild(toast);

    // 次のフレームで表示クラスを追加
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 2秒後に消去（以前より少し早く）
    setTimeout(() => {
        if (toast.parentNode === container) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === container) container.removeChild(toast);
            }, 300);
        }
    }, 2000);
}

/**
 * オンライン時刻を同期する
 */
async function syncOnlineTime() {
    const btn = document.getElementById('source-toggle');
    if (btn) btn.textContent = 'SYNC';
    showToast('Syncing time...');

    try {
        console.log('%c[System] Syncing with online time server (timeapi.io)...', 'color: #4A90E2;');
        
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tokyo', {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const serverTime = new Date(data.dateTime).getTime();
        const localTime = Date.now();
        
        const targetOffset = serverTime - localTime;
        window.isOnlineTime = true;
        
        // GSAPを使用してオフセットをスムーズに変化させる
        gsap.to(window, {
            timeOffset: targetOffset,
            duration: 1.2,
            ease: "power2.out"
        });
        
        if (btn) btn.textContent = 'ON'; // NET -> ON
        showToast('Synced with online time');
    } catch (error) {
        console.error('[System] Online sync failed:', error);
        window.isOnlineTime = false;
        window.timeOffset = 0;
        if (btn) {
            btn.textContent = 'ERR';
            showToast('Sync failed');
            setTimeout(() => { btn.textContent = 'OFF'; }, 2000); // INT -> OFF
        }
    }
}

/**
 * 時間ソースを切り替える
 */
window.toggleTimeSource = function() {
    if (!window.isOnlineTime) {
        syncOnlineTime();
    } else {
        gsap.to(window, {
            timeOffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                window.isOnlineTime = false;
            }
        });
        const btn = document.getElementById('source-toggle');
        if (btn) btn.textContent = 'OFF'; // INT -> OFF
        showToast('Switched to offline clock');
    }
};

/**
 * 時間形式を切り替える
 */
window.toggleTimeFormat = function() {
    const timeDisplay = document.getElementById('time');
    
    // 表示の切り替えをスムーズにする（フェードアウト -> 変更 -> フェードイン）
    gsap.to(timeDisplay, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        onComplete: () => {
            window.is24HourFormat = !window.is24HourFormat;
            const btn = document.getElementById('format-toggle');
            if (btn) {
                btn.textContent = window.is24HourFormat ? '24H' : '12H';
            }
            
            showToast(window.is24HourFormat ? 'Switched to 24-hour format' : 'Switched to 12-hour format');
            
            gsap.to(timeDisplay, {
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: "back.out(1.7)"
            });
        }
    });
};

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

    // OS/端末判定
    let os = "Unknown OS";
    if (lower.includes("win")) os = "Windows";
    else if (lower.includes("iphone")) os = "iPhone";
    else if (lower.includes("ipad")) os = "iPad";
    else if (lower.includes("mac")) os = "Mac";
    else if (lower.includes("android")) os = "Android";
    else if (lower.includes("linux")) os = "Linux";

    // Safariモバイル判定 (iOSのブラウザ全般)
    const isSafariMobile =
        /iP(ad|hone|od)/i.test(ua) &&
        /Safari/i.test(ua) &&
        !/CriOS|FxiOS|EdgiOS|Line/i.test(ua);

    return { name, os, ua, lower, keyword, isSafariMobile };
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
        const formatBtn = document.getElementById('format-toggle');
        const sourceBtn = document.getElementById('source-toggle');

        if (!document.fullscreenElement) {
            console.log('%c[Fullscreen] Requesting standard fullscreen...', 'color: #4A90E2;');
            document.documentElement.requestFullscreen()
                .then(() => {
                    console.log('%c[Fullscreen] Standard fullscreen: ON', 'color: #4A90E2; font-weight: bold;');
                    // フルスクリーン時はUIを隠す
                    if (navContainer) navContainer.style.display = 'none';
                    if (helpBtn) helpBtn.style.display = 'none';
                    if (formatBtn) formatBtn.style.display = 'none';
                    if (sourceBtn) sourceBtn.style.display = 'none';
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
                    if (formatBtn) formatBtn.style.display = '';
                    if (sourceBtn) sourceBtn.style.display = '';
                });
            }
        }
    }
}

// ヘルプモーダルの制御
function initHelpModal() {
    const helpBtn = document.getElementById('help-btn');
    const formatBtn = document.getElementById('format-toggle');
    const sourceBtn = document.getElementById('source-toggle');
    const closeBtn = document.getElementById('close-help');
    const modal = document.getElementById('help-modal');

    if (helpBtn) {
        helpBtn.addEventListener('click', (e) => {
            console.log('%c[Modal] Opening help modal', 'color: #9387A9;');
            e.stopPropagation(); // 背景のフルスクリーン切り替えを防ぐ
            if (modal) {
                modal.style.display = 'flex';
                gsap.fromTo(modal.querySelector('.modal-content'),
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        });
    }

    if (formatBtn) {
        formatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.toggleTimeFormat();
        });
    }

    if (sourceBtn) {
        sourceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.toggleTimeSource();
        });
    }

    if (closeBtn && modal) {
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
    }

    // モーダルの外側をクリックしても閉じる
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }
}
