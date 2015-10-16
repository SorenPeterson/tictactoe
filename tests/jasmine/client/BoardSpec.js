(function() {
	"use strict";
	jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

	var board = new Board();
	var state = board.state.get();
	describe("Board", function () {
		it("starts empty", function () {
			expect(state.length).toBe(9);
			expect(_(state).every(function(spot) {
				return spot === 0;
			});
		});
	});
})();
