const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let board = [];
let boardSize = 3;
let currentPlayer = CROSS;
let gameOnGoing = true;

startGame();
addResetListener();

function startGame() {
    renderGrid(boardSize);
    initBoard(boardSize);
}

function initBoard(dimension) {
    boardSize = dimension;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(EMPTY));
    currentPlayer = CROSS;
    gameOnGoing = true;
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (board[row][col] !== EMPTY || !gameOnGoing) {
        return;
    }

    board[row][col] = currentPlayer;
    renderSymbolInCell(currentPlayer, row, col);
    

    const hasWinner = checkForWinner(currentPlayer);
    if (hasWinner) {
        hasWinner.cell.array.forEach(([row, col]) => {
            renderSymbolInCell(currentPlayer, row, col, 'red')
        });
        alert(`Победитель: ${currentPlayer}`)
    }
    if (board.flat().every(field => field !== EMPTY)) {
        alert("Победила дружба");
        gameOnGoing = false;
        return;
    }

    currentPlayer = currentPlayer == CROSS ? ZERO : CROSS;

    console.log(`Clicked on cell: ${row}, ${col}`);
}

function checkForWinner (player) {
    const size = boardSize;

    for (let r = 0; r < size; r++) {
        if (board[r].every(cell => cell === player)) {
            return Array.from({ length: size }, (_, c) => [r, c]);
        }
    }

    for (let c = 0; c < size; c++) {
        const column = board.map(row => row[c]);
        if (column.every(cell => cell === player)) {
            return Array.from({ length: size }, (_, r) => [r, c]);
        }
    }

    const mainDiagonal = board.map((row, i) => row[i]);
    if (mainDiagonal.every(cell => cell === player)) {
        return Array.from({ length: size }, (_, i) => [i, i]);
    }

    const secondaryDiagonal = board.map((row, i) => row[size - 1 - i]);
    if (secondaryDiagonal.every(cell => cell === player)) {
        return Array.from({ length: size }, (_, i) => [i, size - 1 - i]);
    }

    return null;
}


function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
