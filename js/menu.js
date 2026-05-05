// --- メニュー操作・テーマ制御 ---
function initMenu() {
    console.log('%c[Menu] Initializing menu system...', 'color: #9387A9;');
    const menuItems = document.querySelectorAll('.menu-item');
    const selectionDot = document.querySelector('.selection-dot');

    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            const theme = item.getAttribute('data-theme');
            console.log(`%c[Theme] Switching to: ${theme}`, 'color: #E16596; font-weight: bold;');
            setActiveTheme(item);
        });
    });

    function setActiveTheme(targetElement) {
        menuItems.forEach(i => i.classList.remove('active'));
        targetElement.classList.add('active');

        const theme = targetElement.getAttribute('data-theme');
        const color = targetElement.getAttribute('data-color');
        
        // classNameの直書きを避け、classListを使用して既存のクラス（is-safari-mobile等）を保持する
        const currentThemes = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
        currentThemes.forEach(c => document.body.classList.remove(c));
        document.body.classList.add(`theme-${theme}`);

        document.documentElement.style.setProperty('--dot-color', color);

        const digital = document.getElementById('digital-clock');
        const analog = document.getElementById('analog-clock');
        if (theme === 'analog') {
            digital.style.display = 'none';
            analog.style.display = 'block';
            initClockFace();
        } else {
            digital.style.display = 'block';
            analog.style.display = 'none';
        }

        updateSelectionDot(targetElement, true);

        gsap.fromTo(targetElement, 
            { scale: 0.7 }, 
            { scale: 1.1, duration: 0.6, ease: "back.out(4)" }
        );
    }

    function updateSelectionDot(targetElement, animate = false) {
        if (!targetElement || !selectionDot) return;

        const navContainer = targetElement.closest('.nav-container');
        const containerRect = navContainer.getBoundingClientRect();
        const itemRect = targetElement.getBoundingClientRect();
        const dotRect = selectionDot.getBoundingClientRect();
        const color = targetElement.getAttribute('data-color');

        const xPosition = (itemRect.left - containerRect.left) + (itemRect.width / 2) - (dotRect.width / 2);

        if (animate) {
            gsap.to(selectionDot, {
                x: xPosition,
                backgroundColor: color,
                duration: 0.6,
                ease: "elastic.out(1, 0.75)"
            });
        } else {
            gsap.set(selectionDot, { x: xPosition, backgroundColor: color });
        }
    }

    // グローバルに公開（リサイズ時に呼べるように）
    window.refreshMenuSelection = () => {
        const activeItem = document.querySelector('.menu-item.active');
        if (activeItem) updateSelectionDot(activeItem, false);
    };

    // 初回配置
    window.refreshMenuSelection();
}
