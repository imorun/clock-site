// --- ユーティリティ ---
function toggleFullscreen() {
    const navContainer = document.querySelector('.nav-container');
    const helpBtn = document.getElementById('help-btn');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .then(() => {
                if (navContainer) navContainer.style.display = 'none';
                if (helpBtn) helpBtn.style.display = 'none';
            })
            .catch(err => console.error(err));
    } else {
        document.exitFullscreen?.();

        if (navContainer) navContainer.style.display = '';
        if (helpBtn) helpBtn.style.display = '';
    }
}

// ヘルプモーダルの制御
function initHelpModal() {
    const helpBtn = document.getElementById('help-btn');
    const closeBtn = document.getElementById('close-help');
    const modal = document.getElementById('help-modal');

    if (!helpBtn || !closeBtn || !modal) return;

    helpBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 背景のフルスクリーン切り替えを防ぐ
        modal.style.display = 'flex';
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    });

    closeBtn.addEventListener('click', () => {
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
