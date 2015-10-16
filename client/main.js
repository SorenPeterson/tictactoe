Minimax = function(board) {
	return _(board.possible_moves.get()).filter(function(move) {
		var test_board = new Board(board.state.get());
		test_board.play(move);
		console.log(test_board.winner.get());
		var score = Score(test_board, 'x');
		return score === 1;
	});
}

Score = function(board, player) {
	console.log(board.state.get());
	console.log(board.winner.get());
	if(board.finished.get()) {
		console.log(board.winner.get());
		return board.winner.get() === player ? 1 : -1;
	} else {
		return 0;
	}
}

var board;

Template.Board.onCreated(function() {
	board = new Board();
	window.theboard = board;
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
		var position = new Number(evt.target.closest('.spot').dataset.id);
		board.play(position);
	},
});

