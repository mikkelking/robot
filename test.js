#!/usr/local/bin/node
//
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

let sets = [
	{
	commands: [
		'PLACE 0,0,NORTH',
		'MOVE',
		'REPORT'
		]
	},
	{
	commands: [
		'PLACE 0,0,NORTH',
		'LEFT',
		'REPORT'
		]
	},
	{
	commands: [
		'PLACE 1,2,EAST',
		'MOVE',
		'MOVE',
		'LEFT',
		'MOVE',
		'REPORT'
		]
	}
];
_.each(sets,s => {
	_.each(s.commands, c => {
		console.log("COMMAND IS "+c);
		let response = robot.do(c);
		console.log("RESPONSE: ",response);
	});
});
