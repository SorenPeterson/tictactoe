var Board = function() {
	this.state = new ReactiveVar([0,0,0,0,0,0,0,0,0]);
	this.doge = "hi";
}

var board;

Template.Board.onCreated(function() {
	board = new Board();
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
		state = board.state.get();
	}
});

