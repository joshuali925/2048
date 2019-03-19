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

function run_simulation_algorithm(trials = 500, depth = 8) {
    id = window.setInterval(function () {
        if (!is_game_over(board)) {
            let move = simulation_get_move(board, trials, depth);
            move_and_display(board, move);
        } else {
            window.clearInterval(id);
        }
    }, 200);
}

function stop() {
    window.clearInterval(id);
}

function measure(trials = 100, depth = 999999999) {
    let t0 = performance.now();
    let steps = 0;
    while (!is_game_over(board)) {
        let move = simulation_get_move(board, trials, depth);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        steps++;
        add_tile(board);
    }
    let t1 = performance.now();
    update_board(board);
    console.log('score = ', score, ', time = ', (t1 - t0), ', time per step = ', (t1 - t0) / steps);
}

function random_move_until(board, depth) {
    let score = 0;
    while (depth-- > 0 && !is_game_over(board)) {
        let move = get_random_move(board);
        let [moved, score_gained] = directions[move](board);
        score += score_gained;
        add_tile(board);
    }
    return score;
}

function simulation_get_move(board, trials, depth) {
    let moves = get_move_list(board);
    if (moves.length === 1) return moves[0];
    let best_score = 0, best_move = 0;

    for (let i = 0; i < moves.length; i++) {
        let score = 0;
        for (let j = 0; j < trials; j++) {
            let new_board = copy_board(board);
            let [moved, init_score] = directions[moves[i]](new_board);
            add_tile(new_board);
            score += init_score + random_move_until(new_board, depth);
        }
        if (score >= best_score) {
            best_score = score;
            best_move = moves[i];
        }
    }
    return best_move;
}

function monte_carlo_get_move(board, trials, depth) {
    let moves = get_move_list(board);
    if (moves.length === 1) return moves[0];
    // [score, lost_count, total_count]
    let stats = {37: [0, 0, 0], 38: [0, 0, 0], 39: [0, 0, 0], 40: [0, 0, 0]};

    for (let i = 0; i < trials; i++) {
        let new_board = copy_board(board);
        let first_move = get_random_move(new_board);
        let [moved, init_score] = directions[first_move](new_board);
        add_tile(new_board);
        let end_score = random_move_until(new_board, depth);
        if (is_game_over(new_board))
            stats[first_move][1]++;
        stats[first_move][0] += init_score + end_score;
        stats[first_move][2]++;
    }

    let optimum = {gain: 0, move: 0};
    for (let i = 37; i <= 40; i++) {
        let weight = 1 - stats[i][1] / stats[i][2];
        weight += Math.sqrt(2) * Math.sqrt(Math.log(trials) / stats[i][2]);
        if (weight > optimum.gain) {
            optimum.gain = weight;
            optimum.move = i;
        }
    }
    return optimum.move;
}
