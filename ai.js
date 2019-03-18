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

let id = 0;
function run_random_algorithm(times=500, max_steps=8) {
    id = window.setInterval(function () {
        if (!is_game_over(board)) {
            let move = random_algorithm(board, times);
            // let move = get_random_move(board)
            move_and_display(board, move);
        } else {
            window.clearInterval(id);
        }
    }, 300);
}

function stop() {
    window.clearInterval(id);
}

function measure(times=500, max_steps=8) {
    let t0 = performance.now();
    let score = 0;
    let steps = 0;
    while (!is_game_over(board)) {
        let move = random_algorithm(board, times, max_steps);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        steps++;
        add_tile(board);
    }
    let t1 = performance.now();
    update_board(board);
    console.log('score = ', score, ', time = ', (t1 - t0), ', time per step = ', (t1 - t0) / steps);
}

function random_move_until(board, first_move, max_steps) {
    let [moved, score] = directions[first_move](board);
    while (max_steps-- > 0 && !is_game_over(board)) {
        let move = get_random_move(board);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        add_tile(board);
    }
    return score;
}

function random_algorithm(board, times, max_steps=100000) {
    let boards = {37: [], 38: [], 39: [], 40: []};
    for (let i = 0; i < times; i++) {
        let new_board = copy_board(board);
        let first_move = get_random_move(new_board);
        let end_score = random_move_until(new_board, first_move, max_steps);
        boards[first_move].push(end_score);
    }
    let optimum = {gain: 0, move: 0};
    for (let i = 37; i <= 40; i++) {
        let scores = boards[i], sum = 0;
        for (let j = 0; j < scores.length; j++)
            sum += scores[j];
        let average_gain = sum / scores.length;
        if (average_gain > optimum.gain) {
            optimum.gain = average_gain;
            optimum.move = i;
        }
    }
    return optimum.move;
}
