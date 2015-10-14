var Board = function() {
	this.state = new ReactiveVar([0,0,0,0,0,0,0,0,0]);
	this.doge = "hi";
}

Board.prototype.reset = function() {
	this.state.set([0,0,0,0,0,0,0,0,0]);
}

Board.prototype.isFull = function() {
	return _(this.state.get()).every(function(spot) {
		return spot !== 0;
	});
}

var board;

Template.Board.onCreated(function() {
	board = new Board();
	Tracker.autorun(function() {
		if(board.isFull()) {
			board.reset();
		};
	});
});

Template.Board.helpers({
	rows: function() {
		var doge = _([0, 1, 2]).map(function(item) {
			var row = board.state.get().slice(item*3,(item+1)*3);
			row = _(row).map(function(original, index) {
				return {
					index: item*3+index,
					value: original
				}
			});
			return row;
		});
		return doge;
	},
	marker: function(letter) {
		switch(letter) {
			case 'x':
		}
	},
});

Template.Board.events({
	'click .spot': function(evt, tmpl) {
		var state = board.state.get();
		var position = new Number(evt.target.closest('.spot').dataset.id);
		state[position] = 'x';
		board.state.set(state);
	}
});

