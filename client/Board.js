Board = function() {
	this.state = new ReactiveVar([0,0,0,0,0,0,0,0,0]);
	this.turn = new ReactiveVar('x');
	this.started = new ReactiveVar(false);
}

Board.prototype.clone = function() {
	var board = new Board();
	board.state.set(this.state.get().slice(0));
	board.turn.set(this.turn.get());
	board.started.set(true);
	return board;
}

Board.prototype.winner = function() {
	var state = this.state.get();
	return _(this.winningLines).reduce(function(winner, line, index) {
		return winner || _(line).reduce(function(last_spot, spot_index, index) {
			if(state[spot_index] !== 0) {
				last_spot = index === 0 ? state[spot_index] : last_spot;
			}
			return last_spot === state[spot_index] ? last_spot : undefined;
		}, undefined);
	}, undefined);
}

Board.prototype.full = function() {
	return _(this.state.get()).every(function(spot) {
		return spot !== 0;
	});
}

Board.prototype.empty = function() {
	return _(this.state.get()).every(function(spot) {
		return spot === 0;
	});
}

Board.prototype.finished = function() {
	return (this.winner() !== undefined) || this.full();
}

Board.prototype.possible_moves = function() {
	var state = this.state.get();
	return _(state).reduce(function(possible_moves, spot, index) {
		return possible_moves.concat(
			spot === 0 ? [index] : []
		);
	}, []);
}

Board.prototype.reset = function() {
	this.state.set([0,0,0,0,0,0,0,0,0]);
	this.turn.set('x');
	this.started.set(false);
}

Board.prototype.play = function(position) {
	var state = this.state.get();
	if(state[position] === 0 && this.started.get()) {
		state[position] = this.turn.get();
		this.turn.set(this.opponent());
		this.state.set(state);
		return true;
	}
	return false;
}

Board.prototype.pass = function() {
	this.turn.set(this.opponent());
}

Board.prototype.opponent = function() {
	return this.turn.get() === 'x' ? 'o' : 'x';
}

Board.prototype.winningLines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

Board.prototype.chooseMove = function() {
	if(this.empty()) {
		this.play(0);
	} else if(this.canWin()) {
		console.log('could win');
	} else if(this.canBlockWin()) {
		console.log('could block win');
	} else if(this.canFork()) {
		console.log('could fork');
	} else if(this.canBlockFork()) {
		console.log('could block fork');
	} else if(this.canPlayCenter()) {
		console.log('can play center');
	} else if(this.canPlayOppositeCorner()) {
		console.log('can play opposite corner');
	} else if(this.canPlayEmptyCorner()) {
		console.log('can play empty corner');
	} else if(this.canPlayEmptySide()) {
		console.log('can play empty side');
	}
}

Board.prototype.canWin = function() {
	var player = this.turn.get();
	var move = _(this.possible_moves()).reduce(function(best_move, possible_move) {
		test_board = this.clone();
		test_board.play(possible_move);
		return test_board.winner() === player ? possible_move : best_move;
	}.bind(this), undefined);
	if(move !== undefined) {
		this.play(move);
		return true;
	} else {
		return false;
	}
}

Board.prototype.canBlockWin = function() {
	var opponent = this.opponent();
	var best_move;
	_(this.possible_moves()).each(function(move) {
		var test_board = this.clone();
		test_board.pass();
		test_board.play(move);
		if(test_board.winner() === opponent) {
			best_move = move;
		}
	}.bind(this));
	if(best_move !== undefined) {
		this.play(best_move);
		return true;
	} else {
		return false;
	}
}

Board.prototype.findFork = function() {
	var opponent = this.opponent();
	var best_move;
	_(this.possible_moves()).each(function(move) {
		var first_move = this.clone();
		first_move.play(move);
		var win_count = _(first_move.possible_moves()).reduce(function(count, possible_win) {
			var second_move = first_move.clone();
			second_move.pass();
			second_move.play(possible_win);
			return count + (second_move.winner() === this.turn.get() ? 1 : 0);
		}.bind(this), 0)
		if(win_count >= 2) {
			best_move = move;
		}
	}.bind(this));
	return best_move;
}

Board.prototype.canFork = function() {
	var best_move = this.findFork();
	if(best_move !== undefined) {
		this.play(best_move);
		return true;
	} else {
		return false;
	}
}

Board.prototype.canBlockFork = function() {
	var opponent = this.opponent();
	var best_move;
	var test_board = this.clone();
	test_board.pass();
	best_move = test_board.findFork();
	if(best_move !== undefined) {
		this.play(best_move);
		return true;
	} else {
		return false;
	}
}

Board.prototype.canPlayCenter = function() {
	if(this.state.get()[4] === 0) {
		this.play(4);
		return true;
	} else  {
		return false;
	}
}

Board.prototype.canPlayOppositeCorner = function() {
	var state = this.state.get();
	var board_places = [0, 2, 8, 6];
	if(_(board_places).every(function(corner, index) {
		if(state[corner] === this.opponent() && state[board_places[(index+2)%4]] === 0) {
			this.play(board_places[(index+2)%4]);
			return false;
		} else {
			return true;
		}
	}.bind(this))) {
		return false;
	} else {
		return true;
	};
}

Board.prototype.canPlayEmptyCorner = function() {
	var state = this.state.get();
	if(_([0, 2, 6, 8]).every(function(corner) {
		if(state[corner] === 0) {
			this.play(corner);
			return false;
		} else {
			return true;
		}
	}.bind(this))) {
		return false;
	} else {
		return true;
	};
}

Board.prototype.canPlayEmptySide = function() {
	var state = this.state.get();
	if(_([1, 3, 5, 7]).every(function(corner) {
		if(state[corner] === 0) {
			this.play(corner);
			return false;
		} else {
			return true;
		}
	}.bind(this))) {
		return false;
	} else {
		return true;
	};
}

