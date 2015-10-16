Board = function() {
	this.state = new ReactiveVar([0,0,0,0,0,0,0,0,0]);
	this.turn = new ReactiveVar('x');
}

Board.prototype.reset = function() {
	this.state.set([0,0,0,0,0,0,0,0,0]);
}

Board.prototype.isFinished = function() {
	return _(this.state.get()).every(function(spot) {
		return spot !== 0;
	});
}

Board.prototype.finished = function() {
	return (this.winner().length > 0) || this.full();
}

Board.prototype.full = function() {
	return _(this.state.get()).every(function(spot) {
		return spot !== 0;
	});
}

Board.prototype.winner = function() {
	var that = this;
	var state = this.state.get();
	var wins = [];
	_(this.winningLines).each(function(line, index) {
		if(state[line[0]] === state[line[1]] && state[line[0]] === state[line[2]]) {
			wins.push([state[line[0]], index]);
		}
	});
	return wins;
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

