// --- ユーティリティ ---
function UItoggleFullscreen() {
    const isCurrentlyPseudo = document.body.classList.toggle('is-pseudo-fullscreen');

    setTimeout(() => {
        if (typeof initClockFace === 'function') initClockFace();
        if (typeof refreshMenuSelection === 'function') refreshMenuSelection();
    }, 100);

    return isCurrentlyPseudo; // ← これ追加
}

function toggleFullscreen() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(`%c[Fullscreen] Device is mobile: ${isMobile}`, 'color: #4A90E2;');

    if (isMobile) {
        const state = UItoggleFullscreen(); // ← 受け取る
        console.log(`%c[Fullscreen] Pseudo-fullscreen (Mobile): ${state ? 'ON' : 'OFF'}`, 'color: #4A90E2; font-weight: bold;');
    } else {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    const state = UItoggleFullscreen();
                    console.log(`%c[Fullscreen] Standard fullscreen: ON (${state})`, 'color: #4A90E2; font-weight: bold;');
                })
                .catch(err => console.error('[Fullscreen] Error:', err));
        } else {
            document.exitFullscreen?.().then(() => {
                const state = UItoggleFullscreen();
                console.log(`%c[Fullscreen] Standard fullscreen: OFF (${state})`, 'color: #4A90E2; font-weight: bold;');
            });
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
