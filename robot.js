/* state.js */
'use strict';
const _ = require('lodash');

const texts = require('./texts');

let robot = function() {

	// Set the bounds of the table
	let table = {
		minX: 0,
		minY: 0,
		maxX: 4,
		maxY: 4
	},

	// Information about the robot's current location and direction
	state = {
		onTable: false,
		x: 0,
		y: 0,
		facing: 'NORTH',
		debug: false
	},

	moves = {
		NORTH: {deltaX:  0, deltaY:  1, left: 'WEST', right: 'EAST'},
		SOUTH: {deltaX:  0, deltaY: -1, left: 'EAST', right: 'WEST'},
		WEST: {deltaX: -1, deltaY:  0, left: 'SOUTH', right: 'NORTH'},
		EAST: {deltaX:  1, deltaY:  0, left: 'NORTH', right: 'SOUTH'}
	},

// Commands that we will accept, and how to parse them
	cmdList = [
		{command: "place",  regex: /\s*place\s*([-]*\d+)[,\s]+([-]*\d+)[,\s]+(\w*)\s*$/i},
		{command: "move",   regex: /\s*move\s*$/i},
		{command: "left",   regex: /\s*left\s*$/i},
		{command: "right",  regex: /\s*right\s*$/i},
		{command: "report", regex: /\s*report\s*$/i},
		{command: "reset",  regex: /\s*reset\s*$/i},
		{command: "status", regex: /\s*status\s*$/i}
	],

	params = [],

// - - - - - - - - - - - - - - - - - - - - - -
//
// Private methods
//
	tryMoveTo = function(newX,newY) {
		debug("tryMoveTo()",newX,newY);
		let success = true;
		if (newX > table.maxX || newX < table.minX) {
			success = false;
		}
		if (newY > table.maxY || newY < table.minY) {
			success = false;
		}
		return success;
	},

	debug = function(msg) {
		if (state.debug)
			console.log(msg);
	},

	parseInput = function(input) {
		debug("command="+input);
		let result = {};
		_.each(cmdList,cmd => {
			let match = cmd.regex.exec(input);
			if (match) {
				debug(match);
				result.command = cmd.command;
				match.shift();
				result.params = match;
				return false;
			}
		});
		if (!result.command)
			result.command = 'unknown';
		return result;
	},

// - - - - - - - - - - - - - - - - - - - - - -
//
// Public methods
//
	placeme = function(newX, newY, facing) {
		debug("Placing at ",newX,newY,facing);
		let success = tryMoveTo(newX, newY);
		if (!success) {
			let msg = texts.MSG_THAT_IS_OFF_TABLE;
			return {status: "error", message: msg};
		}
		else {
			state.x = parseInt(newX,10);
			state.y = parseInt(newY,10);
			state.facing = facing.toUpperCase();
			state.onTable = true;
		}
		return {status: "ok"};
	},

	left = function() {
		if (!state.onTable)
			return {status: "error", message: texts.PLACE_ME_ON_TABLE};
		state.facing = moves[state.facing].left;
		return {status: "ok"};
	},

	right = function() {
		if (!state.onTable)
			return {status: "error", message: texts.PLACE_ME_ON_TABLE};
		state.facing = moves[state.facing].right;
		return {status: "ok"};
	},

	moveme = function() {
		if (!state.onTable)
			return {status: "error", message: texts.NOT_ON_TABLE};
		let newX = state.x + moves[state.facing].deltaX;
		let newY = state.y + moves[state.facing].deltaY;
		let success = tryMoveTo(newX, newY);
		if (!success) {
			let msg = texts.MSG_FALL_OFF_TABLE_PRE+state.facing+texts.MSG_FALL_OFF_TABLE_POST;
			return {status: "error", message: msg};
		} else {
			state.x = newX;
			state.y = newY;
		}
		return {status: "ok"};
	},

	report = function() {
		if (!state.onTable)
			return {status: "error", message: texts.NOT_ON_TABLE};
		let msg = "X: " + state.x + ", Y: " + state.y + ", facing: "+state.facing;
		debug(msg);
		return {status: "ok", message: msg};
	},

	status = function() {
		return {status: "ok", onTable: state.onTable, x: state.x, y: state.y, facing: state.facing};
	},

	reset = function() {
		state.onTable = false;
		state.x = 0;
		state.y = 0;
		state.facing = "NORTH";
		return {status: "ok"};
	},

	doCommand = function(line) {
		let cmd = parseInput(line);
		debug(texts.COMMAND_IS,cmd.command);
		let result;
	  switch(cmd.command) {
	    case 'place':
	    	result = robot.place(cmd.params[0],cmd.params[1],cmd.params[2]);
	      break;
	    case 'left':
	    	result = robot.left();
	      break;
	    case 'right':
	    	result = robot.right();
	      break;
	    case 'move':
	    	result = robot.move();
	      break;
	    case 'report':
	    	result = robot.report();
	      break;
	    case 'status':
	    	result = robot.status();
	      break;
	    case 'reset':
	    	result = robot.reset();
	      break;
	    case 'quit':
	    	quit();
	      break;
	    default:
	      result = {status: "error", message: texts.NON_CAPISCE + line.trim() + "'"};
	      break;
	  }
	  return result;
	};

	return {
		left: left,
		right: right,
		move: moveme,
		place: placeme,
		report: report,
		status: status,
		reset: reset,
		do: doCommand
	};

}();

module.exports = robot;
