var dlx = require("dlx");
var _ = require("underscore");

function row_column_constraint(i) {
	var x = i % 9;
	var y = Math.floor(i / 9);
	return x + "," + y;
}

function row_number_constraint(i, n) {
	var y = Math.floor(i / 9);
	return n + "@R" + y;
}

function column_number_constraint(i, n) {
	var x = i % 9;
	return n + "@C" + x;
}

function box_number_constraint(i, n) {
	var x = i % 9;
	var y = Math.floor(i / 9);
	var box = Math.floor(y / 3) * 3 + Math.floor(x / 3);
	return n + "@B" + box;
}

function i_n_to_constraints(i, n) {
	return [
		row_column_constraint(i),
		row_number_constraint(i, n),
		column_number_constraint(i, n),
		box_number_constraint(i, n)
	];
}

function row_id(i, n) {
	return n + "@" + i;
}

function constraint_to_index(c) {
	return ALL_CONSTRAINTS[c];
}

function constraints(sudoku) {
	var constraints = {};
	for (var i = 0; i < 81; ++i) {
		var n = sudoku[i];
		if (typeof n === 'number' && n >= 1 && n <= 9) {
			var cs = i_n_to_constraints(i, n);
			_.each(cs, function (c) {
				if (constraints[c]) {
					throw new Error("unsolvable sudoku");
				}
				constraints[c] = true;
			});
		}
	}
	return constraints;
}

function convert_columns_to_numbers(rows) {
	var cols = {};
	_.flatten(_.values(rows)).forEach(function (col) {
		cols[col] = true;
	});
	cols = _.keys(cols).sort();
	_.each(_.keys(rows), function (key) {
		rows[key] = _.map(rows[key], function (col) {
			return cols.indexOf(col);
		});
	});
}

// `sudoku` is an array of length 81 containing numbers 0-9
function solve(sudoku) {
	var taken_constraints = constraints(sudoku);
	var rows = {};
	for (var i = 0; i < 81; ++i) {
		for (var n = 1; n <= 9; ++n) {
			var cs = i_n_to_constraints(i, n);
			var possible = true;
			_.each(cs, function (c) {
				if (taken_constraints[c]) {
					possible = false;
				}
			});
			if (!possible) {
				continue;
			}

			rows[row_id(i, n)] = cs;
		}
	}

	convert_columns_to_numbers(rows);
	var row_ids = Object.keys(rows);
	var sparse_matrix = row_ids.map(function (id) {
		return rows[id];
	});

	console.log("Calling dlx.solve...");
	var solutions = dlx.solve_sparse_matrix(sparse_matrix);
	return solutions.map(function (solution) {
		return show_solution(solution, row_ids, sudoku);
	});
}

function show_solution(chosen_rows, row_ids, sudoku) {
	sudoku = [].concat(sudoku);
	chosen_rows.forEach(function (row) {
		var match = row_ids[row].match(/(\d+)@(\d+)/);
		var n = parseInt(match[1], 10);
		var i = parseInt(match[2], 10);
		sudoku[i] = n;
	});
	return sudoku;
}

exports.solve = solve;
