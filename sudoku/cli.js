#!/usr/bin/env node
var cli = require("cli");
var solver = require("./solver.js");

function solveSudoku(sudoku) {
	var solutions;
	try {
		solutions = solver.solve(sudoku);
	}
	catch (ex) {
		this.output("Invalid sudoku: " + ex + "\n");
		return;
	}

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

cli.withStdin(function (input) {
	var digits = input.replace(/[^\d]+/g, "");
	var strings = digits.match(/(\d{81})/g);
	if (!strings || strings.length === 0) {
		this.output("No sudokus given\n");
		return;
	}
	if (digits.length % 81 !== 0) {
		this.output("warn: trailing digits in input\n");
	}

	var sudokus = strings.map(function (string) {
		return string.split("").map(Number);
	});
	sudokus.forEach(solveSudoku.bind(this));
});
