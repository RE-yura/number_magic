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
}

// 指示文更新
function updateInstruction() {
    const instruction = document.getElementById('instruction');
    instruction.textContent = `1-${maxNumber}の中で好きな数字を選んでください。\n画面に表示される数字群の中に自分の選んだ数字があれば「ある」ボタンを、なければ「ない」ボタンをクリックしてください。`;
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
    document.getElementById('result-number').textContent = selectedNum;
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
    
    if (e.key === '1' || e.key === 'Enter') {
        updateScreen(true);
    } else if (e.key === '0' || e.key === 'Escape') {
        updateScreen(false);
    }
});

