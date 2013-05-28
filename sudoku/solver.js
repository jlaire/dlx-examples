var dlx = require("dlx");
var _ = require("underscore");

function constraint_tags(i, n) {
	var x = i % 9;
	var y = Math.floor(i / 9);
	var box = Math.floor(y / 3) * 3 + Math.floor(x / 3);
	return [
		x + "," + y,
		n + "@R" + y,
		n + "@C" + x,
		n + "@B" + box
	];
}

function constraints(sudoku) {
	var error_strings = [
		"Houston, we have a problem",
		"a row contains duplicates",
		"a column contains duplicates",
		"a 3x3 box contains duplicates"
	];

	var constraints = {};
	for (var i = 0; i < 81; ++i) {
		var n = sudoku[i];
		if (typeof n === "number" && n >= 1 && n <= 9) {
			var cs = constraint_tags(i, n);
			_.each(cs, function (c, i) {
				if (constraints[c]) {
					throw new Error(error_strings[i]);
				}
				constraints[c] = true;
			});
		}
	}
	return constraints;
}

// `sudoku` is an array of length 81 containing numbers 0-9
function solve(sudoku) {
	if (!_.isArray(sudoku) || sudoku.length !== 81) {
		throw new Error("invalid argument");
	}

	var taken_constraints = constraints(sudoku);
	var rows = {};
	for (var i = 0; i < 81; ++i) {
		for (var n = 1; n <= 9; ++n) {
			var cs = constraint_tags(i, n);
			var possible = true;
			_.each(cs, function (c) {
				if (taken_constraints[c]) {
					possible = false;
				}
			});
			if (possible) {
				rows[n + "@" + i] = cs;
			}
		}
	}

	return dlx.solve_tagged_matrix(rows).map(show_solution.bind(null, sudoku));
}

function show_solution(sudoku, solution) {
	sudoku = [].concat(sudoku);
	solution.forEach(function (row) {
		var match = row.match(/(\d+)@(\d+)/);
		var n = parseInt(match[1], 10);
		var i = parseInt(match[2], 10);
		sudoku[i] = n;
	});
	return sudoku;
}

exports.solve = solve;
