# 数字予測マジック

## 🌐 Web アプリケーション（推奨）

最も簡単にアクセスできる方法です。ブラウザで `index.html` を開くだけで遊べます。

### 使い方

1. `index.html` をブラウザで開く
2. 「1-100 の数字」または「1-1000 の数字」のモードを選択
3. 好きな数字を選ぶ
4. 画面に表示される数字群の中に自分の選んだ数字があれば「ある」ボタンを、なければ「ない」ボタンをクリック
5. 何回か繰り返すと、あら不思議、自分の選んだ数字を見事に言い当てられる??

### キーボードショートカット

- `1` または `Enter`: 「ある」ボタン
- `0` または `Escape`: 「ない」ボタン

### GitHub Pages で公開する方法

1. **リポジトリを GitHub にプッシュ**

   ```bash
   git add .
   git commit -m "Add web application"
   git push origin main
   ```

2. **GitHub Pages を有効化**

   - GitHub リポジトリのページにアクセス
   - `Settings` → `Pages` を開く
   - `Source` セクションで `Deploy from a branch` を選択
   - `Branch` を `main`（または `master`）に設定
   - `Folder` を `/ (root)` に設定
   - `Save` をクリック

3. **アクセス**
   - 数分待つと、`https://[ユーザー名].github.io/number_magic/` でアクセス可能になります
   - リポジトリ名が `number_magic` の場合、URL は `https://[ユーザー名].github.io/number_magic/` です

### その他のデプロイ方法

Netlify、Vercel などの静的ホスティングサービスにアップロードするだけで、誰でもアクセスできるようになります。

## 🖥️ デスクトップアプリケーション（PyQt5）

### 実行方法

```
$ sudo apt install python3-pyqt5
$ python3 magic100.py
```

### 遊び方

- magic100.py

  1-100 の中で好きな数字を選んで下さい．  
  画面に表示される数字群の中に自分の選んだ数字があれば｢ある｣ボタンを，なければ｢ない｣ボタンをクリックして下さい．  
  何回か繰り返すと，あら不思議，自分の選んだ数字を見事に言い当てられる??

- magic1000.py

  1-1000 の中で好きな数字を選んで下さい．
  あとは magic100.py の遊び方と一緒です．
