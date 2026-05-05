window.addEventListener('DOMContentLoaded', () => {
    console.log('%c[System] App initializing...', 'color: #4A90E2; font-weight: bold;');

    // モジュール化したブラウザ情報を取得
    const browserData = getBrowserData();
    const { name, ua, lower, keyword, isSafariMobile } = browserData;

    // --- ログ表示 (複数ハイライト + バージョン黄色) ---
    let format = `%c[Browser: ${name}] `;
    let styles = ['color: #73AFCE; font-weight: bold;'];

    let i = 0;
    while (i < ua.length) {
        const restLower = lower.slice(i);
        if (keyword && restLower.startsWith(keyword)) {
            format += `%c${ua.slice(i, i + keyword.length)}`;
            styles.push('color: red; font-weight: bold;');
            i += keyword.length;
            continue;
        }
        const versionMatch = restLower.match(/^\/\d+(\.\d+)*/);
        if (versionMatch) {
            const ver = ua.slice(i, i + versionMatch[0].length);
            format += `%c${ver}`;
            styles.push('color: yellow; font-weight: bold;');
            i += versionMatch[0].length;
            continue;
        }
        format += `%c${ua[i]}`;
        styles.push('color: #4e778b;');
        i++;
    }
    console.log(format, ...styles);
    console.log(`%c[Browser] Safari Mobile: ${isSafariMobile}`, 'color: #73AFCE;');

    if (isSafariMobile) {
        document.body.classList.add('is-safari-mobile');
    }

    initClockFace();
    initMenu();
    initHelpModal();
    updateClock();

    console.log('%c[System] App ready!', 'color: #27ae60; font-weight: bold;');
});

// リサイズイベントの登録
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

window.toggleFullscreen = toggleFullscreen;
