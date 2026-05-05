/**
 * User-Agent情報と検出されたブラウザ名をサーバーに送信するテスト用関数
 */
function sendUADataToServer() {
    // ユーティリティからブラウザ情報を取得
    const { name, ua, lower } = getBrowserData();

    // 最初にテスト用のPOSTを送信
    fetch('http://10.104.242.195:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            test: "test"
        })
    })
    .then(response => {
        console.log('%c[Test] 接続成功。ブラウザ情報を送信中...', 'color: #E16596; font-weight: bold;');
        
        // 本来のUA送信処理
        return fetch('http://10.104.242.195:5000/debug-ua/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                ua: ua, 
                lower: lower,
                browser: name // ブラウザ名を追加
            })
        });
    })
    .then(response => {
        if (response && !response.ok) throw new Error('データ送信失敗');
        return response ? response.json() : null;
    })
    .then(data => {
        if (data) console.log('%c[Test] サーバーからのレスポンス:', 'color: #27ae60;', data);
    })
    .catch(error => {
        console.error('%c[Test] サーバーへの接続に失敗しました。この関数を無効化します。', 'color: #e74c3c;');
        window.sendUADataToServer = function() {
            console.warn('[Test] サーバー接続失敗により、この関数は無効化されています。');
        };
    });
}
sendUADataToServer();
