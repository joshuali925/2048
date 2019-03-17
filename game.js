function updateBoard(board, oldBoard, direction, addTwo) {
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
        $('.number').remove();
        for (let i = 0; i < board.length; i++)
            for (let j = 0; j < board[0].length; j++)
                updateGrid(board, i, j);
        if (addTwo) {
            let [i, j] = addTile(board);
            if (isGameOver(board))
                $('#button').text('Game over');
            updateGrid(board, i, j, true);
        }
        mergedPos.forEach(function(pos) {
            $('#number' + pos).css('animation', 'pop ' + duration);
        });
    });
}

function updateGrid(board, i, j, appearEffect = false) {
    let pos = '-' + i + '-' + j;
    if (board[i][j] > 0) {
        let num = board[i][j];
        let html = '<span class="number" id="number' + pos + '">' + num + '</span>';
        $('#grid' + pos).append(html);
    }
    setColor(pos, board[i][j]);
    if (appearEffect)
        $('#number' + pos).css('animation', 'appear ' + duration);
}


function init() {
    score = 0;
    $('#score').text(score);
    $('#button').text('Restart');
    board = getNewBoard();
    addTile(board);
    addTile(board);
    updateBoard(board);
}

let directions = {37: left, 40: down, 38: up, 39: right};
let duration = '0.2s';
let score;
let board;

init();
$(document).keydown(function (e) {
    let [moved, score_gained] = [false, 0], oldBoard;
    if (e.which in directions) {
        oldBoard = getNewBoard();
        for (let i = 0; i < board.length; i++)
            for (let j = 0; j < board[0].length; j++)
                oldBoard[i][j] = board[i][j];
        [moved, score_gained] = directions[e.which](board);
    }
    if (moved) {
        score += score_gained;
        console.log(score, score_gained)
        $('#score').text(score);
        updateBoard(board, oldBoard, e.which, true);
    }
});

function pop(i, j) {
    let pos = '-' + i + '-' + j;
    $('#number' + pos).css('animation', 'pop ' + duration);
}

function slide(i, j, direction, n) {
    if (n <= 0)
        return;
    n = n * 112 + 'px';
    let pos = '-' + i + '-' + j;
    let fast = 50;
    if (direction === 'left')
        $('#number' + pos).animate({right: n}, fast);
    else if (direction === 'down')
        $('#number' + pos).animate({top: n}, fast);
    else if (direction === 'up')
        $('#number' + pos).animate({bottom: n}, fast);
    else if (direction === 'right')
        $('#number' + pos).animate({left: n}, fast);
}

function setColor(pos, num) {
    let [color_bg, color_fg] = getColor(num);
    $('#number' + pos).css({'background-color': color_bg, 'color': color_fg});
}

function getColor(num) {
    let color_bg = '', color_fg = num > 4 ? '#f9f6f2' : '#776e65';
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
            color_bg = "#9c0";
            break;
        case 1024:
            color_bg = "#33b5e5";
            break;
        case 2048:
            color_bg = "#09c";
            break;
        case 4096:
            color_bg = "#a6c";
            break;
        case 8192:
            color_bg = "#93c";
            break;
    }
    return [color_bg, color_fg];
}
