// --- アナログ時計の描画・制御 ---
function initClockFace() {
    const marksContainer = document.getElementById('marks-container');
    const numbersContainer = document.getElementById('numbers-container');
    const clockFace = document.querySelector('.clock-face');
    
    if (!marksContainer || !numbersContainer || !clockFace) return;

    console.log('%c[Clock] Initializing clock face rendering...', 'color: #A67C52;');

    marksContainer.innerHTML = '';
    numbersContainer.innerHTML = '';

    // リサイズに対応するため、現在の時計のサイズから半径を計算
    const faceWidth = clockFace.clientWidth;
    const radius = faceWidth * 0.38; // 外枠に対して適切な余白を持たせる

    console.log(`%c[Clock] Face width: ${faceWidth}px, radius: ${radius.toFixed(2)}px`, 'color: #A67C52; font-size: 0.9em;');

    // 目盛りの描画
    for (let i = 0; i < 60; i++) {
        const mark = document.createElement('div');
        mark.className = 'mark';
        if (i % 5 === 0) mark.classList.add('hour-mark');
        mark.style.transform = `rotate(${i * 6}deg)`;
        
        // 中心点（transform-origin）を動的に設定
        mark.style.transformOrigin = `50% ${faceWidth / 2}px`;
        
        marksContainer.appendChild(mark);
    }

    // 数字の描画
    for (let i = 1; i <= 12; i++) {
        const angle = (i * 30) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius;
        
        const label = document.createElement('div');
        label.className = 'number-label';
        label.textContent = i;
        label.style.left = '50%';
        label.style.top = '50%';
        label.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        numbersContainer.appendChild(label);
    }
}

function updateClock() {
    // 現在の時刻を取得 (内蔵またはオンライン同期オフセットを適用)
    let now = new Date();
    if (window.isOnlineTime && window.timeOffset !== 0) {
        now = new Date(Date.now() + window.timeOffset);
    }

    const ms = now.getMilliseconds();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    // デジタル表示
    let displayH = h;
    let ampm = "";
    if (!window.is24HourFormat) {
        ampm = h >= 12 ? " PM" : " AM";
        displayH = h % 12 || 12; // 0時は12時として表示
    }

    const hStr = String(displayH).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');
    
    const timeDisplay = document.getElementById('time');
    if (timeDisplay) timeDisplay.textContent = `${hStr}:${mStr}:${sStr}${ampm}`;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} (${days[now.getDay()]})`;
    
    const digitalDate = document.getElementById('date');
    const analogDate = document.getElementById('analog-date');
    if (digitalDate) digitalDate.textContent = dateStr;
    if (analogDate) analogDate.textContent = dateStr.split(' ')[0];

    // アナログ時計の針 (ぬるぬる動かすためにミリ秒も考慮)
    const sDeg = (s * 6) + (ms * 0.006);
    const mDeg = (m * 6) + (s * 0.1) + (ms * 0.0001);
    const hDeg = (h % 12 * 30) + (m * 0.5) + (s * (0.5 / 60));

    const sh = document.getElementById('second-hand');
    const mh = document.getElementById('minute-hand');
    const hh = document.getElementById('hour-hand');

    if (sh) sh.style.transform = `rotate(${sDeg}deg)`;
    if (mh) mh.style.transform = `rotate(${mDeg}deg)`;
    if (hh) hh.style.transform = `rotate(${hDeg}deg)`;

    // 次のフレームで更新
    requestAnimationFrame(updateClock);
}
