function render(board, score) {
    $('.number').remove();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 0)
                continue;
            let pos = '-' + i + '-' + j;
            let num = board[i][j] === 0 ? '' : board[i][j];
            let html = '<span class="number" id="number' + pos + '">' + num + '</span>';
            $('#grid' + pos).append(html);
            setColor(pos, board[i][j]);
        }
    }
    $('#score').text(score);
}

function setColor(pos, num) {
    let color_bg = '';
    let color_fg = '#776e65';
    if (num > 4)
        color_fg = '#f9f6f2';
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
    $('#grid' + pos).css('background-color', color_bg);
    $('#number' + pos).css('color', color_fg);
}

let board;

function startGame() {
    board = getNewBoard();
    let score = 0;
    render(board, score);
    $(document).keydown(function (e) {
        let [moved, score_gained] = [false, 0];
        if (e.which === 37)
            [moved, score_gained] = left(board);
        else if (e.which === 40)
            [moved, score_gained] = down(board);
        else if (e.which === 38)
            [moved, score_gained] = up(board);
        else if (e.which === 39)
            [moved, score_gained] = right(board);
        if (moved) {
            score += score_gained;
            add_tile(board);
            render(board, score);
            if (isGameOver(board))
                alert('Game over.');
            // console.log(e.which);
            // console.table(board);
        }
    })
}

startGame();