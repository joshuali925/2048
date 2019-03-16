function add_tile(board) {
    let i, j;
    do {
        i = Math.floor(Math.random() * board.length);
        j = Math.floor(Math.random() * board.length);
    } while (board[i][j] !== 0);
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function getNewBoard() {
    let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    add_tile(board);
    add_tile(board);
    return board;
}

function swap_zeros_to_the_left(row) {
    let j = row.length - 1;
    let k = row.length - 1;
    let moved = false;
    while (k >= 0) {
        if (row[j] !== 0) {
            j--;
            k = j - 1;
        } else if (row[k] === 0) {
            k--;
        } else {
            let temp = row[j];
            row[j] = row[k];
            row[k] = temp;
            moved = true;
        }
    }
    return moved;
}

function right(board) {
    let score = 0;
    let moved = false;
    for (let i = 0; i < board.length; i++) {
        moved = swap_zeros_to_the_left(board[i]) || moved;
        for (let j = board.length - 1; j > 0; j--) { // j = 3, 2, 1
            if (board[i][j] !== 0 && board[i][j] === board[i][j - 1]) {
                board[i][j] *= 2;
                board[i][j - 1] = 0;
                score += board[i][j];
                moved = true;
            }
        }
        moved = swap_zeros_to_the_left(board[i]) || moved;
    }
    return [moved, score];
}

function rotateClockwise(board) {
    let n = board.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
        for (let j = 0; j < n; j++) {
            let temp = board[i][j];
            board[i][j] = board[n - 1 - i][j];
            board[n - 1 - i][j] = temp;
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            let temp = board[i][j];
            board[i][j] = board[j][i];
            board[j][i] = temp;
        }
    }
}

function up(board) {
    rotateClockwise(board);
    let [moved, score] = right(board);
    rotateClockwise(board);
    rotateClockwise(board);
    rotateClockwise(board);
    return [moved, score];
}

function left(board) {
    rotateClockwise(board);
    rotateClockwise(board);
    let [moved, score] = right(board);
    rotateClockwise(board);
    rotateClockwise(board);
    return [moved, score];
}

function down(board) {
    rotateClockwise(board);
    rotateClockwise(board);
    rotateClockwise(board);
    let [moved, score] = right(board);
    rotateClockwise(board);
    return [moved, score];
}

function isGameOver(board) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === 0 || (i + 1 < n && board[i][j] === board[i + 1][j])
                || (j + 1 < n && board[i][j] === board[i][j + 1])) {
                return false;
            }
        }
    }
    return true;
}
