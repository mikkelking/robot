#!/usr/local/bin/node
'use strict';

const _ = require('lodash');
const readline = require('readline');
const minimist = require('minimist');

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
// Supported switches:
// 		--debug - shows debug output
//		--overwrite - set to overwrite data every time
let opts = minimist(process.argv.slice(2));

const texts = require('./texts');
const robot = require('./robot');


// Commands that we will accept, and how to parse them
let cmdList = [
	{command: "place",  regex: /\s*place\s*([-]*\d+)[,\s]+([-]*\d+)[,\s]+(\w*)\s*$/},
	{command: "move",   regex: /\s*move\s*$/},
	{command: "left",   regex: /\s*left\s*$/},
	{command: "right",  regex: /\s*right\s*$/},
	{command: "report", regex: /\s*report\s*$/}
];

// - - - - - - - - - - - - - - - - - - - - 
// Functions
// 
function quit() {
  console.log(texts.CLOSING);
  rl.close();
}

function debug(msg) {
	if (opts.debug)
		console.log(msg);
}

// Command responses sent here
function respond(msg) {
	console.log(msg);
}


function parseInput(input) {
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
}


// - - - - - - - - - - - - - - - - - - - - 
// Main code
// 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: texts.COMMAND_PROMPT
});

rl.prompt();

rl.on('line', (line) => {
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
		  if (!result.error)
    		respond(result.message);
      break;
    case 'quit':
    	quit();
      break;
    default:
      result = {status: "error", message: texts.NON_CAPISCE + line.trim() + "'"};
      break;
  }
  if (result.status === "error")
  	respond("Error: "+result.message);
  else 
  	respond("ok"); 
  rl.prompt();
}).on('close', () => {
  respond(texts.THANKS);
  process.exit(0);
});
