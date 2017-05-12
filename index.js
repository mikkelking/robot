#!/usr/local/bin/node

const readline = require('readline');
const _ = require('lodash');
const texts = require('./texts');

// Commands that we will accept, and how to parse them
let cmdList = [
	{command: "place",  regex: /\s*place\s*(\d+)[,\s]+(\d+)[,\s]+(\w*)\s*$/},
	{command: "move",   regex: /\s*move\s*$/},
	{command: "left",   regex: /\s*left\s*$/},
	{command: "right",  regex: /\s*right\s*$/},
	{command: "report", regex: /\s*report\s*$/}
];

// Set the bounds of the table
let table = {
	minX: 0,
	minY: 0,
	maxX: 5,
	maxY: 5
};

// Information about the robot's current location and direction
let robot = {
	onTable: false,
	x: 0,
	y: 0,
	facing: 'NORTH'
};

let moves = {
	NORTH: {deltaX:  0, deltaY:  1, left: 'EAST', right: 'WEST'},
	SOUTH: {deltaX:  0, deltaY: -1, left: 'WEST', right: 'EAST'},
	EAST: {deltaX: -1, deltaY:  0, left: 'SOUTH', right: 'NORTH'},
	WEST: {deltaX:  1, deltaY:  0, left: 'NORTH', right: 'SOUTH'}
};

let params = [];

function parseInput(input) {
	let result = {};
	_.each(cmdList,cmd => {
		let match = cmd.regex.exec(input);
		console.log(match);
		if (match) {
			result.command = cmd.command;
			match.shift();
			result.params = match;
			return false;
		}
	});
	if (!result.command)
		result.command = 'unknown';
	return result;
}

function quit() {
  console.log(texts.CLOSING);
  rl.close();
}

function placeme(newX, newY, facing) {
	console.log("Placing at ",newX,newY,facing);
	let success = tryMoveTo(newX, newY);
	if (!success)
		console.log(texts.MSG_FALL_OFF_TABLE);
	else {
		robot.x = parseInt(newX,10);
		robot.y = parseInt(newY,10);
		robot.facing = facing.toUpperCase();
		robot.onTable = true;
	}
}

function left() {
	robot.facing = moves[robot.facing].left;
}

function right() {
	robot.facing = moves[robot.facing].right;
}

function tryMoveTo(newX,newY) {
	console.log("tryMoveTo()",newX,newY);
	let success = true;
	if (newX > table.maxX || newX < table.minX) {
		success = false;
	}
	if (newY > table.maxY || newY < table.minY) {
		success = false;
	}
	return success;
}

function moveme() {
	let newX = robot.x + moves[robot.facing].deltaX;
	let newY = robot.y + moves[robot.facing].deltaY;
	let success = tryMoveTo(newX, newY);
	if (!success)
		console.log(texts.MSG_FALL_OFF_TABLE);
	else {
		robot.x = newX;
		robot.y = newY;
	}
}

function report() {
	console.log("X: " + robot.x + ", Y: " + robot.y + ", facing: "+robot.facing);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: texts.COMMAND_PROMPT
});


rl.prompt();

rl.on('line', (line) => {
	let cmd = parseInput(line);
	console.log(texts.COMMAND_IS,cmd);
	if (!robot.onTable && cmd.command !== 'place') {
		console.log(texts.PLACE_ME_ON_TABLE);
	} else {
	  switch(cmd.command) {
	    case 'place':
	    	placeme(cmd.params[0],cmd.params[1],cmd.params[2]);
	      break;
	    case 'left':
	    	left();
	      break;
	    case 'right':
	    	right();
	      break;
	    case 'move':
	    	moveme();
	      break;
	    case 'report':
	    	report();
	      break;
	    case 'quit':
	    	quit();
	      break;
	    default:
	      console.log(texts.NON_CAPISCE + line.trim() + "'");
	      break;
	  }
	  report();
	}
  rl.prompt();
}).on('close', () => {
  console.log(texts.THANKS);
  process.exit(0);
});
