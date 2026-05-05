window.addEventListener('DOMContentLoaded', () => {
    console.log('%c[System] App initializing...', 'color: #4A90E2; font-weight: bold;');

    // ブラウザ判定ロジックの追加
    const ua = window.navigator.userAgent;
    const lower = ua.toLowerCase();

    let browser = "";
    let keyword = "";

    // 判定 + ハイライト用キーワード
    if (lower.includes("edge") || lower.includes("edg")) {
        browser = "Edge";
        keyword = "edg"; // UAは Edg
    } else if (lower.includes("chrome")) {
        browser = "Chrome";
        keyword = "chrome";
    } else if (lower.includes("safari")) {
        browser = "Safari";
        keyword = "safari";
    } else if (lower.includes("firefox")) {
        browser = "Firefox";
        keyword = "firefox";
    } else if (lower.includes("msie")) {
        browser = "Internet Explorer";
        keyword = "msie";
    } else if (lower.includes("trident")) {
        browser = "Internet Explorer";
        keyword = "trident";
    } else {
        browser = "Other";
        keyword = "";
    }

    const index = lower.indexOf(keyword);

    if (index !== -1 && keyword !== "") {
        const before = ua.slice(0, index);
        const match = ua.slice(index, index + keyword.length);
        const after = ua.slice(index + keyword.length);

        console.log(
            `%c[Browser: ${browser}] %c${before}%c${match}%c${after}`,
            'color: #73AFCE;; font-weight: bold;',
            'color: #4e778b',
            'color: red; font-weight: bold;',
            'color: #4e778b'
        );
    } else {
        console.log(`%c[Browser: ${browser}] ${ua}`, 'color: #73AFCE;');
    }
    // Safariモバイル判定 (iOSのブラウザ全般)
    const isSafariMobile = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent) ||
        (/iP(ad|hone|od)/i.test(navigator.userAgent) && !window.MSStream);

    console.log(`%c[Browser] Safari Mobile: ${isSafariMobile}`, 'color: #73AFCE;');

    if (isSafariMobile) {
        document.body.classList.add('is-safari-mobile');
    }

    initClockFace();
    initMenu();
    initHelpModal();
    updateClock(); // 内部で requestAnimationFrame を呼ぶように変更済み

    console.log('%c[System] App ready!', 'color: #27ae60; font-weight: bold;');
});

// リサイズイベントの登録（デバウンス処理付き）
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('%c[Resize] Window resized, re-rendering components...', 'color: #FABB74;');
        initClockFace();
        if (typeof refreshMenuSelection === 'function') {
            refreshMenuSelection();
        }
    }, 150);
});

// フルスクリーン機能のバインド
window.toggleFullscreen = toggleFullscreen;
