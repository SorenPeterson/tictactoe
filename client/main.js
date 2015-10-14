var Board = function() {
	this.state = new ReactiveVar(['x','o',0,0,0,0,0,0,0]);
	this.doge = "hi";
}

var board;

Template.Board.onCreated(function() {
	board = new Board();
});

Template.Board.helpers({
	rows: function() {
		var doge = _([0, 1, 2]).map(function(item) {
			return board.state.get().slice(item*3,(item+1)*3);
		});
		return doge;
	},
	marker: function(letter) {
		switch(letter) {
			case 'x':
		}
	},
});

