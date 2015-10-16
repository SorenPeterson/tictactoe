Board = function(initial_state) {
	this.state = new ReactiveVar((initial_state || [0,0,0,0,0,0,0,0,0]).slice(0));
	this.turn = new ReactiveVar('x');
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
		state[position] = this.turn();
		this.turn.set(this.turn() === 'x' ? 'o' : 'x');
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

