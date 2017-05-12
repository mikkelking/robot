#!/usr/local/bin/node
'use strict';

const _ = require('lodash');
const readline = require('readline');

const texts = require('./texts');
const robot = require('./robot');


// Commands that we will accept, and how to parse them
let cmdList = [
	{command: "place",  regex: /\s*place\s*(\d+)[,\s]+(\d+)[,\s]+(\w*)\s*$/},
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

function parseInput(input) {
	let result = {};
	_.each(cmdList,cmd => {
		let match = cmd.regex.exec(input);
		if (match) {
			console.log(match);
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
	console.log(texts.COMMAND_IS,cmd.command);
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
    		console.log(result.message);
      break;
    case 'quit':
    	quit();
      break;
    default:
      result = {status: "error", message: texts.NON_CAPISCE + line.trim() + "'"};
      break;
  }
  if (result.status === "error")
  	console.log("Error: "+result.message);
  else 
  	console.log("ok"); 
  rl.prompt();
}).on('close', () => {
  console.log(texts.THANKS);
  process.exit(0);
});
