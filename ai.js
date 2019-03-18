function get_random_move(board) {
    let moves = get_move_list(board);
    return moves[Math.floor(Math.random() * moves.length)];
}

let can_move = {37: can_move_left, 40: can_move_down, 38: can_move_up, 39: can_move_right};
function get_move_list(board) {
    let moves = [];
    for (let i = 37; i <= 40; i++) {
        if (can_move[i](board))
            moves.push(i);
    }
    return moves;
}

function run_random_algorithm(board, times) {
    let id = window.setInterval(function () {
        if (!is_game_over(board)) {
            let move = random_algorithm(board, times);
            move_and_display(board, move);
        } else {
            window.clearInterval(id);
        }
    }, 500);
}

function measure(times) {
    let t0 = performance.now();
    let score = 0;
    while (!is_game_over(board)) {
        let move = random_algorithm(board, times);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        add_tile(board);
    }
    let t1 = performance.now();
    update_board(board);
    console.log('score = ', score, ', time = ', (t1 - t0));
}

function random_until_over(board, first_move) {
    let [moved, score] = directions[first_move](board);
    while (!is_game_over(board)) {
        let move = get_random_move(board);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        add_tile(board);
    }
    return score;
}

function random_algorithm(board, times) {
    let boards = {37: [], 38: [], 39: [], 40: []};
    for (let i = 0; i < times; i++) {
        let new_board = copy_board(board);
        let first_move = get_random_move(new_board);
        let end_score = random_until_over(new_board, first_move);
        boards[first_move].push(end_score);
    }
    let optimum = 0, optimum_move = 0;
    for (let i = 37; i <= 40; i++) {
        let scores = boards[i], sum = 0;
        for (let j = 0; j < scores.length; j++)
            sum += scores[j];
        let average_gain = sum / scores.length;
        if (average_gain > optimum) {
            optimum = average_gain;
            optimum_move = i;
        }
    }
    return optimum_move;
}