from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# プロジェクトのルートディレクトリ
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/', methods=['GET', 'POST'])
def index():
    """index.html を配布、または接続テスト用 POST を処理"""
    if request.method == 'POST':
        print("[Debug Server] 接続テスト用 POST を受信しました")
        return jsonify({"status": "success", "message": "Connection test passed"})
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """その他の静的ファイル (CSS, JS, 外部ライブラリ等) を配布"""
    return send_from_directory(BASE_DIR, path)

@app.route('/debug-ua/', methods=['POST'])
def debug_ua():
    """UA情報とブラウザ名のデバッグ用エンドポイント"""
    data = request.json
    ua = data.get('ua')
    lower = data.get('lower')
    browser = data.get('browser') # ブラウザ名を取得
    
    print("\n" + "="*50)
    print("[Debug Server] 受信データ:")
    print(f"  Browser: {browser}") # ブラウザ名を表示
    print(f"  Raw UA:  {ua}")
    print(f"  Lower:   {lower}")
    print("="*50 + "\n")
    
    return jsonify({
        "status": "success",
        "message": "User-Agent data received",
        "data": data
    })

if __name__ == '__main__':
    print(f"Debug Server starting on http://localhost:5000")
    print("ブラウザで http://localhost:5000 を開くと時計が表示されます。")
    app.run(port=5000, debug=True, host="0.0.0.0")
