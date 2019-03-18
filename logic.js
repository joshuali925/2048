function add_tile(board) {
    let empty = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 0)
                empty.push([i, j]);
        }
    }
    let [i, j] = empty[Math.floor(Math.random() * empty.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
    return [i, j]
}


function get_new_board() {
    return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}

function copy_board(board) {
    let temp = get_new_board();
    for (let i = 0; i < board.length; i++)
        for (let j = 0; j < board[0].length; j++)
            temp[i][j] = board[i][j];
    return temp;
}

function swap_zeros_to_left(row) {
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
        moved = swap_zeros_to_left(board[i]) || moved;
        for (let j = board.length - 1; j > 0; j--) { // j = 3, 2, 1
            if (board[i][j] !== 0 && board[i][j] === board[i][j - 1]) {
                board[i][j] *= 2;
                board[i][j - 1] = 0;
                score += board[i][j];
                moved = true;
            }
        }
        moved = swap_zeros_to_left(board[i]) || moved;
    }
    return [moved, score];
}

function rotate_clockwise(board) {
    let n = board.length;
    for (let i = 0; i < (n / 2 >> 0); i++) {
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
    rotate_clockwise(board);
    let [moved, score] = right(board);
    rotate_clockwise(board);
    rotate_clockwise(board);
    rotate_clockwise(board);
    return [moved, score];
}

function left(board) {
    rotate_clockwise(board);
    rotate_clockwise(board);
    let [moved, score] = right(board);
    rotate_clockwise(board);
    rotate_clockwise(board);
    return [moved, score];
}

function down(board) {
    rotate_clockwise(board);
    rotate_clockwise(board);
    rotate_clockwise(board);
    let [moved, score] = right(board);
    rotate_clockwise(board);
    return [moved, score];
}

function is_game_over(board) {
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

function can_move_right(board) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - 1; j++) {
            if (board[i][j] !== 0 && (board[i][j + 1] === board[i][j] || board[i][j + 1] === 0))
                return true;
        }
    }
    return false;
}

function can_move_left(board) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = n - 1; j > 0; j--) {
            if (board[i][j] !== 0 && (board[i][j - 1] === board[i][j] || board[i][j - 1] === 0))
                return true;
        }
    }
    return false;
}

function can_move_down(board) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - 1; j++) {
            if (board[j][i] !== 0 && (board[j + 1][i] === board[j][i] || board[j + 1][i] === 0))
                return true;
        }
    }
    return false;
}

function can_move_up(board) {
    let n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = n - 1; j > 0; j--) {
            if (board[j][i] !== 0 && (board[j - 1][i] === board[j][i] || board[j - 1][i] === 0))
                return true;
        }
    }
    return false;
}