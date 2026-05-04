window.addEventListener('DOMContentLoaded', () => {
    initClockFace();
    initMenu();
    updateClock(); // 内部で requestAnimationFrame を呼ぶように変更済み
});

// フルスクリーン機能のバインド
window.toggleFullscreen = toggleFullscreen;
