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
    document.getElementById('numbers-grid').classList.toggle('is-dense', maxNumber === 1000);

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
}

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

