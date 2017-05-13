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
	if (line.match(/quit/i))
		return quit();
	try {
		let result = robot.do(line);
		if (line.match(/report/i))
			respond(result.message);
	  if (result.status === "error")
	  	respond("Error: "+result.message);
	} catch(e) {
		console.error("Exception",e);
	}
  rl.prompt();
}).on('close', () => {
  respond(texts.THANKS);
  process.exit(0);
});
