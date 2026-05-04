// --- メニュー操作・テーマ制御 ---
function initMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    const selectionDot = document.querySelector('.selection-dot');

    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            setActiveTheme(item);
        });
    });

    function setActiveTheme(targetElement) {
        menuItems.forEach(i => i.classList.remove('active'));
        targetElement.classList.add('active');

        const theme = targetElement.getAttribute('data-theme');
        const color = targetElement.getAttribute('data-color');
        
        document.body.className = `theme-${theme}`;
        document.documentElement.style.setProperty('--dot-color', color);

        const digital = document.getElementById('digital-clock');
        const analog = document.getElementById('analog-clock');
        if (theme === 'analog') {
            digital.style.display = 'none';
            analog.style.display = 'block';
        } else {
            digital.style.display = 'block';
            analog.style.display = 'none';
        }

        const navContainer = targetElement.closest('.nav-container');
        const containerRect = navContainer.getBoundingClientRect();
        const itemRect = targetElement.getBoundingClientRect();
        const dotRect = selectionDot.getBoundingClientRect();

        const xPosition = (itemRect.left - containerRect.left) + (itemRect.width / 2) - (dotRect.width / 2);

        gsap.to(selectionDot, {
            x: xPosition,
            backgroundColor: color,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)"
        });

        gsap.fromTo(targetElement, 
            { scale: 0.7 }, 
            { scale: 1.1, duration: 0.6, ease: "back.out(4)" }
        );
    }

    const initialItem = document.querySelector('.menu-item.active');
    if (initialItem) {
        const color = initialItem.getAttribute('data-color');
        const navContainer = initialItem.closest('.nav-container');
        const containerRect = navContainer.getBoundingClientRect();
        const itemRect = initialItem.getBoundingClientRect();
        const dotRect = selectionDot.getBoundingClientRect();

        const xPosition = (itemRect.left - containerRect.left) + (itemRect.width / 2) - (dotRect.width / 2);
        gsap.set(selectionDot, { x: xPosition, backgroundColor: color });
    }
}
