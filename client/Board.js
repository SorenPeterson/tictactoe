Board = function() {
	this.state = new ReactiveVar([0,0,0,0,0,0,0,0,0]);
	this.turn = new ReactiveVar('x');
}

Board.prototype.clone = function() {
	var board = new Board();
	board.state.set(this.state.get().slice(0));
	board.turn.set(this.turn.get());
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
}

Board.prototype.play = function(position) {
	var state = this.state.get();
	if(state[position] === 0) {
		state[position] = this.turn.get();
		this.turn.set(this.turn.get() === 'x' ? 'o' : 'x');
		this.state.set(state);
	}
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
	if(this.canWin()) {
	} else if(this.canBlockWin()) {
	} else if(this.canFork()) {
	} else if(this.canBlockFork()) {
	} else if(this.canPlayCenter()) {
	} else if(this.canPlayOppositeCorner()) {
	} else if(this.canPlayEmptyCorner()) {
	} else if(this.canPlayEmptySide()) {}
}

Board.prototype.canWin = function() {
	var player = this.turn.get();
	var move = _(this.possible_moves()).reduce(function(best_move, possible_move) {
		test_board = this.clone();
		test_board.play(possible_move);
		console.log(test_board.winner());
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
}

Board.prototype.canFork = function() {
}

Board.prototype.canBlockFork = function() {
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
		if(state[corner] !== 0 && state[board_places[(index+2)%4]] === 0) {
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

