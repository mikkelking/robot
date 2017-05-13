#!/usr/local/bin/node
//
'use strict';

const _ = require('lodash');
const readline = require('readline');
const minimist = require('minimist');
const assert = require('assert');

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
	name: "1",
	commands: [
		'RESET',
		'PLACE 0,0,NORTH',
		'MOVE',
		'REPORT'
		],
	status: {x: 0, y: 1, facing: 'NORTH'}
	},

	{
	name: "2",
	commands: [
		'RESET',
		'PLACE 0,0,NORTH',
		'LEFT',
		'REPORT'
		],
	status: {x: 0, y: 0, facing: 'WEST'}
	},

	{
	name: "3",
	commands: [
		'RESET',
		'PLACE 1,2,EAST',
		'MOVE',
		'MOVE',
		'LEFT',
		'MOVE',
		'REPORT'
		],
	status: {x: 3, y: 3, facing: 'NORTH'}
	},

	{
	name: "5 - Grand tour",
	commands: [
		'RESET',
		'PLACE 0,4,EAST',
		'MOVE',
		'MOVE',
		'LEFT',
		'MOVE',
		'MOVE',
		'MOVE',
		'MOVE',
		'LEFT',
		'MOVE',
		'MOVE',
		'MOVE',
		'MOVE',
		'LEFT',
		'MOVE',
		'MOVE',
		'MOVE',
		'MOVE',
		'REPORT',
		'PLACE -1,4,EAST',		// These last 4 placements should all be ignored, as off table
		'PLACE 0,5,EAST',
		'PLACE 0,999,WEST',
		'PLACE 99,4,NORTH'
		],
	status: {x: 0, y: 0, facing: 'SOUTH'}
	}

];
_.each(sets,s => {
	describe("Results of command sequence "+s.name, function() {
		_.each(s.commands, c => {
			console.log("COMMAND IS "+c);
			let response = robot.do(c);
			console.log("RESPONSE: ",response);
		});

	// Now check the result

		let current = robot.status();
		let same = true;
		_.each(_.keys(s.status),e => {
			if (current[e] !== s[e])
				same = false;
			describe(e, function() {
		    it('should match', function() {
		      assert.equal(current[e], s.status[e]);
		    });
	    });
		});
	});
});
