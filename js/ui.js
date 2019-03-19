function animate_move(board, oldBoard, direction, addTwo) {
    let mergedPos = [];
    if (direction === 37) {
        let n = board.length;
        for (let i = 0; i < n; i++) {  // fix a row
            for (let j = 0; j < n; j++) {  // find a non zero number
                if (board[i][j] === 0) continue;
                let count = 0;
                for (let k = j; k < n; k++) {  // find where the number came from
                    if (oldBoard[i][k] === 0) continue;
                    slide(i, k, 'left', k - j);
                    let oldNum = oldBoard[i][k];
                    oldBoard[i][k] = 0;
                    if (oldNum === board[i][j] || ++count === 2) break;  // break if did not merge or slided twice
                    mergedPos.push('-' + i + '-' + j);  // merged, add to list for animation
                }
            }
        }
    } else if (direction === 39) {
        let n = board.length;
        for (let i = 0; i < n; i++) {
            for (let j = n - 1; j >= 0; j--) {
                if (board[i][j] === 0) continue;
                let count = 0;
                for (let k = j; k >= 0; k--) {
                    if (oldBoard[i][k] === 0) continue;
                    slide(i, k, 'right', j - k);
                    let oldNum = oldBoard[i][k];
                    oldBoard[i][k] = 0;
                    if (oldNum === board[i][j] || ++count === 2) break;
                    mergedPos.push('-' + i + '-' + j);
                }
            }
        }
    } else if (direction === 40) {
        let n = board.length;
        for (let i = 0; i < n; i++) {
            for (let j = n - 1; j >= 0; j--) {
                if (board[j][i] === 0) continue;
                let count = 0;
                for (let k = j; k >= 0; k--) {
                    if (oldBoard[k][i] === 0) continue;
                    slide(k, i, 'down', j - k);
                    let oldNum = oldBoard[k][i];
                    oldBoard[k][i] = 0;
                    if (oldNum === board[j][i] || ++count === 2) break;
                    mergedPos.push('-' + j + '-' + i);
                }
            }
        }
    } else if (direction === 38) {
        let n = board.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (board[j][i] === 0) continue;
                let count = 0;
                for (let k = j; k < n; k++) {
                    if (oldBoard[k][i] === 0) continue;
                    slide(k, i, 'up', k - j);
                    let oldNum = oldBoard[k][i];
                    oldBoard[k][i] = 0;
                    if (oldNum === board[j][i] || ++count === 2) break;
                    mergedPos.push('-' + j + '-' + i);
                }
            }
        }
    }
    $(":animated").promise().done(function () {
        update_board(board);
        if (addTwo) {
            let [i, j] = add_tile(board);
            if (is_game_over(board))
                $('#score').text(score + ', game over!');
            update_grid(board, i, j, true);
        }
        mergedPos.forEach(function (pos) {
            $('#number' + pos).css('animation', 'pop ' + duration);
        });
    });
}

function update_board(board) {
    $('.number').remove();
    $('#score').text(score);
    for (let i = 0; i < board.length; i++)
        for (let j = 0; j < board[0].length; j++)
            update_grid(board, i, j);
}

function update_grid(board, i, j, appearEffect = false) {
    let pos = '-' + i + '-' + j;
    if (board[i][j] > 0) {
        let num = board[i][j];
        let html = '<span class="number" id="number' + pos + '">' + num + '</span>';
        $('#grid' + pos).append(html);
    }
    set_color(pos, board[i][j]);
    if (appearEffect)
        $('#number' + pos).css('animation', 'appear ' + duration);
}

function move_and_display(board, move) {
    let oldBoard, [moved, score_gained] = [false, 0];
    if (move in directions) {
        oldBoard = copy_board(board);
        [moved, score_gained] = directions[move](board);
    }
    if (moved) {
        score += score_gained;
        $('#score').text(score);
        animate_move(board, oldBoard, move, true);
    }
}

function init() {
    score = 0;
    $('#score').text(score);
    board = get_new_board();
    add_tile(board);
    add_tile(board);
    animate_move(board);
}

let directions = {37: left, 40: down, 38: up, 39: right};
let duration = 100;
let score;
let board;

init();
$(document).keydown(function (e) {
    move_and_display(board, e.which);
});

function pop(i, j) {
    let pos = '-' + i + '-' + j;
    $('#number' + pos).css('animation', 'pop ' + duration);
}

function slide(i, j, direction, n) {
    if (n <= 0) return;
    n = n * 112 + 'px';
    let pos = '-' + i + '-' + j;
    let delay = 70;
    if (direction === 'left')
        $('#number' + pos).animate({right: n}, delay);
    else if (direction === 'down')
        $('#number' + pos).animate({top: n}, delay);
    else if (direction === 'up')
        $('#number' + pos).animate({bottom: n}, delay);
    else if (direction === 'right')
        $('#number' + pos).animate({left: n}, delay);
}

function set_color(pos, num) {
    let [color_bg, color_fg, font_size] = get_color(num);
    $('#number' + pos).css({'background-color': color_bg, 'color': color_fg, 'font-size': font_size});
}

function get_color(num) {
    let font_size = 60 - Math.floor(Math.log10(num)) * 6;
    let color_bg = '#000000', color_fg = num > 4 ? '#f9f6f2' : '#776e65';
    switch (num) {
        case 0:
            color_bg = "#cdc0b4";
            break;
        case 2:
            color_bg = "#eee4da";
            break;
        case 4:
            color_bg = "#ede0c8";
            break;
        case 8:
            color_bg = "#f2b179";
            break;
        case 16:
            color_bg = "#f59563";
            break;
        case 32:
            color_bg = "#f67c5f";
            break;
        case 64:
            color_bg = "#f65e3b";
            break;
        case 128:
            color_bg = "#edcf72";
            break;
        case 256:
            color_bg = "#edcc61";
            break;
        case 512:
            color_bg = "#edc850";
            break;
        case 1024:
            color_bg = "#edc53f";
            break;
        case 2048:
            color_bg = "#edc22e";
            break;
    }
    return [color_bg, color_fg, font_size + 'px'];
}
