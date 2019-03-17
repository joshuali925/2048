function updateBoard(board, oldBoard, direction) {
    $('.number').remove();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            updateGrid(board, i, j);
        }
    }
}

function updateGrid(board, i, j, animated=undefined) {
    let pos = '-' + i + '-' + j;
    if (board[i][j] > 0) {
        let num = board[i][j];
        let html = '<span class="number" id="number' + pos + '">' + num + '</span>';
        $('#grid' + pos).append(html);
    }
    setColor(pos, board[i][j]);
    if (animated === 'appear')
        $('#number' + pos).css('animation', 'appear ' + duration);
}


function startGame() {
    let score = 0;
    board = getNewBoard();
    addTile(board);
    addTile(board);
    updateBoard(board, score);
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
            $('#score').text(score);
            updateBoard(board, oldBoard, e.which);
            let [i, j] = addTile(board);
            updateGrid(board, i, j, 'appear');
            if (isGameOver(board))
                alert('Game over.');
        }
    })
}

let directions = {37: left, 40: down, 38: up, 39: right};
let duration = '0.2s';
let board;

startGame();

function slide(pos, direction, n) {
    n = n * 112 + 'px';
    if (direction === 37)
        $('#number' + pos).animate({right: n}, duration, function () {
            $(this).remove();
        });
    else if (direction === 40)
        $('#number' + pos).animate({top: n}, duration, function () {
            $(this).remove();
        });
    else if (direction === 38)
        $('#number' + pos).animate({bottom: n}, duration, function () {
            $(this).remove();
        });
    else if (direction === 39)
        $('#number' + pos).animate({left: n}, duration, function () {
            $(this).remove();
        });
}

function setColor(pos, num) {
    let [color_bg, color_fg] = getColor(num);
    $('#number' + pos).css('background-color', color_bg).css('color', color_fg);
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