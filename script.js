let maxNumber = 0;
let step = 0;
let selectedNum = 0;
let bits = [];
let maxStep = 0;

// ゲーム開始
function startGame(max) {
    maxNumber = max;
    step = 0;
    selectedNum = 0;
    
    // ビット計算の準備
    const all = Array.from({length: maxNumber}, (_, i) => i + 1);
    maxStep = max === 100 ? 6 : 9;
    bits = Array.from({length: maxStep + 1}, () => []);
    
    // 各数字をビット位置ごとに分類
    for (const num of all) {
        for (let j = 0; j <= maxStep; j++) {
            if ((num & (1 << j)) === (1 << j)) {
                bits[j].push(num);
            }
        }
    }
    
    // UI更新
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('mode-label').textContent = `1〜${maxNumber} モード`;
    document.getElementById('game-screen').classList.toggle('is-dense', maxNumber === 1000);

    createScreen(step);
    updateInstruction();
}

// 画面作成
function createScreen(stepIndex) {
    const grid = document.getElementById('numbers-grid');
    grid.innerHTML = '';
    
    const numbers = bits[stepIndex];
    numbers.forEach(num => {
        const item = document.createElement('div');
        item.className = 'number-item';
        item.textContent = num;
        grid.appendChild(item);
    });

    // カード番号のスタンプと、刷り直し演出
    document.getElementById('card-no').textContent = `No.${stepIndex + 1}`;
    document.getElementById('card-total').textContent = `/${maxStep + 1}`;
    const sheet = document.getElementById('sheet');
    sheet.scrollTop = 0;
    replayAnimation(sheet);
    replayAnimation(document.getElementById('card-stamp'));
    fitNumbers();
}

// 1〜1000モード: カードの広さに全部の数字が収まる、いちばん大きい文字サイズと列数を選ぶ
const FIT_DIGIT_EM = 0.52;  // 数字1文字の幅（Zen Kaku Gothic New 太字）
const FIT_GAP_EM = 0.5;     // 列と列のすき間
const FIT_LINE_HEIGHT = 1.25; // style.css の .is-dense .number-item と合わせる
const FIT_MIN_PX = 9;       // これより小さくはしない（収まらなければスクロール）
const FIT_MAX_PX = 24;

function fitNumbers() {
    const screen = document.getElementById('game-screen');
    const grid = document.getElementById('numbers-grid');
    if (!screen.classList.contains('is-dense') || screen.classList.contains('hidden') || !grid.lastElementChild) {
        return;
    }

    const sheet = document.getElementById('sheet');
    const style = getComputedStyle(sheet);
    const width = sheet.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const height = sheet.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 1;
    const count = grid.children.length;
    // 4桁は最後の「1000」だけなので3桁で計算し、はみ出しは列のすき間で吸収する
    const digits = Math.min(grid.lastElementChild.textContent.length, 3);

    let best = { size: 0, cols: 1 };
    for (let cols = 4; cols <= 40; cols++) {
        const rows = Math.ceil(count / cols);
        const size = Math.min(
            width / cols / (digits * FIT_DIGIT_EM + FIT_GAP_EM),
            height / rows / FIT_LINE_HEIGHT
        );
        if (size > best.size) {
            best = { size, cols };
        }
    }

    const size = Math.min(FIT_MAX_PX, Math.max(FIT_MIN_PX, Math.floor(best.size * 10) / 10));
    grid.style.setProperty('--cols', best.cols);
    grid.style.setProperty('--size', `${size}px`);
}

// 画面の回転やウィンドウのサイズ変更で、カードの広さが変わったら計算し直す
new ResizeObserver(fitNumbers).observe(document.getElementById('sheet'));

// CSSアニメーションを最初から再生し直す
function replayAnimation(el) {
    el.classList.remove('is-printing');
    void el.offsetWidth;
    el.classList.add('is-printing');
}

// 指示文更新
function updateInstruction() {
    const instruction = document.getElementById('instruction');
    instruction.textContent = 'この中に、きみの数はある？';
}

// 画面更新
function updateScreen(isThere) {
    if (isThere) {
        // ビット位置の最初の数字（2^step）を加算
        selectedNum += bits[step][0];
    }
    
    if (step === maxStep) {
        showResult();
        return;
    }
    
    step++;
    createScreen(step);
}

// 結果表示
function showResult() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    const resultNumber = document.getElementById('result-number');
    resultNumber.textContent = selectedNum;
    resultNumber.dataset.digits = String(selectedNum).length;
}

// ゲーム再開
function restartGame() {
    document.getElementById('mode-selection').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    
    maxNumber = 0;
    step = 0;
    selectedNum = 0;
    bits = [];
}

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen.classList.contains('hidden')) {
        return;
    }
    
    // フォーカス中のボタンが Enter で押されて二重に進まないよう、既定動作を止める
    if (e.key === '1' || e.key === 'Enter') {
        e.preventDefault();
        updateScreen(true);
    } else if (e.key === '0' || e.key === 'Escape') {
        e.preventDefault();
        updateScreen(false);
    }
});

