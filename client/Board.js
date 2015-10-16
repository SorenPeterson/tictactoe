Board = function(initial_state) {
	this.state = new ReactiveVar((initial_state || [0,0,0,0,0,0,0,0,0]).slice(0));
	this.turn = new ReactiveVar('x');

	var that = this;

	this.winner = new ReactiveVar([]);
	Tracker.autorun(function() {
		var state = that.state.get();
		that.winner.set(_(that.winningLines).reduce(function(winner, line, index) {
			return winner || _(line).reduce(function(last_spot, spot_index, index) {
				if(state[spot_index] !== 0) {
					last_spot = index === 0 ? state[spot_index] : last_spot;
				}
				return last_spot === state[spot_index] ? last_spot : undefined;
			}, undefined);
		}, undefined));
	});

	this.full = new ReactiveVar(false);
	Tracker.autorun(function() {
		that.full.set(
			_(that.state.get()).every(function(spot) {
				return spot !== 0;
			})
		)
	});

	this.finished = new ReactiveVar(false);
	Tracker.autorun(function() {
		that.finished.set(
			(that.winner.get() !== undefined) || that.full.get()
		);
	});

	this.possible_moves = new ReactiveVar();
	Tracker.autorun(function() {
		var state = that.state.get();
		that.possible_moves.set(_(state).reduce(function(possible_moves, spot, index) {
			return possible_moves.concat(
				spot === 0 ? [index] : []
			);
		}, []));
	});
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

