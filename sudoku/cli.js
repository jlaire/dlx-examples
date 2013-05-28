#!/usr/bin/env node
var cli = require("cli");
var solver = require("./solver.js");

function usage() {
	this.output("No sudokus given\n");
}

function solveSudoku(sudoku) {
	var array = sudoku.split("").map(Number);

	try {
		var solutions = solver.solve(array);
		if (solutions.length === 0) {
			this.output("No solutions\n");
		}
		else if (solutions.length === 1) {
			this.output(solutions[0].join("") + "\n");
		}
		else {
			this.output(solutions.length + " solutions, here's one:");
			this.output(solutions[0].join("") + "\n");
		}
	}
	catch (ex) {
		this.output("Invalid sudoku: " + ex + "\n");
	}
}

cli.withStdin(function (input) {
	var digits = input.replace(/[^\d]+/g, "");
	var sudokus = digits.match(/(\d{81})/g);
	if (!sudokus || sudokus.length === 0) {
		usage.call(this);
		return;
	}
	if (digits.length % 81 !== 0) {
		this.output("warn: garbage input\n");
	}
	sudokus.forEach(solveSudoku.bind(this));
});
