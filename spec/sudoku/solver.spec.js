describe("sudoku/solver.js", function () {
	var solver = require("../../sudoku/solver.js");

	it("loads successfully", function () {
		expect(solver).toBeDefined();
		expect(solver.solve).toBeDefined();
	});

	describe("solve()", function () {
		it("solves a simple sudoku", function () {
			var input = [
				3,5,0,1,0,9,0,7,6,
				0,6,0,0,7,0,0,4,0,
				4,0,0,0,3,0,0,0,9,
				0,1,0,7,6,3,0,8,0,
				0,0,0,0,0,0,0,0,0,
				5,9,7,0,0,0,4,6,3,
				8,2,1,0,5,0,6,3,4,
				9,0,5,4,2,6,8,0,7,
				7,0,0,0,8,0,0,0,2,
			];
			
			var solved = [
				3,5,8,1,4,9,2,7,6,
				1,6,9,2,7,5,3,4,8,
				4,7,2,6,3,8,1,5,9,
				2,1,4,7,6,3,9,8,5,
				6,8,3,5,9,4,7,2,1,
				5,9,7,8,1,2,4,6,3,
				8,2,1,9,5,7,6,3,4,
				9,3,5,4,2,6,8,1,7,
				7,4,6,3,8,1,5,9,2,
			];

			var solutions = solver.solve(input);
			expect(solutions.length).toEqual(1);
			expect(solutions[0]).toEqual(solved);
		});

		it("throws when given an invalid sudoku", function () {
			expect(solver.solve.bind(null, [
				0,0,0,0,0,0,0,0,0,
				1,0,0,1,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
			])).toThrow(new Error("a row contains duplicates"));

			expect(solver.solve.bind(null, [
				0,0,0,0,1,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,1,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
			])).toThrow(new Error("a column contains duplicates"));

			expect(solver.solve.bind(null, [
				5,0,0,0,0,0,0,0,0,
				0,5,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
			])).toThrow(new Error("a 3x3 box contains duplicates"));
		});

		it("throws when given an invalid argument", function () {
			expect(solver.solve.bind(null, null)).toThrow(new Error("invalid argument"));
			expect(solver.solve.bind(null, [])).toThrow(new Error("invalid argument"));
			expect(solver.solve.bind(null, {})).toThrow(new Error("invalid argument"));
			expect(solver.solve.bind(null, [1,2])).toThrow(new Error("invalid argument"));
		});
	});
});
