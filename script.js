window.addEventListener('DOMContentLoaded', () => {
    initHelpModal()
    initClockFace();
    initMenu();
    updateClock(); // 内部で requestAnimationFrame を呼ぶように変更済み
});

// リサイズイベントの登録（デバウンス処理付き）
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initClockFace();
        if (typeof refreshMenuSelection === 'function') {
            refreshMenuSelection();
        }
    }, 150);
});

// フルスクリーン機能のバインド
window.toggleFullscreen = toggleFullscreen;
