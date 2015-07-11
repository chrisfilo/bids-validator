var validate    = require('./index.js');
var colors      = require('colors/safe');
var ProgressBar = require('progress');
var utils       = require('./utils');

module.exports = function (args) {

	var dir  = args[2];

	if (dir) {

		var bar;
		utils.readDir(dir, function (files) {
			// initialize progressbar
			bar = new ProgressBar('validating [:bar]', { total: Object.keys(files).length + 1 });

		    validate.BIDS(dir, function (issues) {
		        console.log();
		        for (var i = 0; i < issues.length; i++) {
		        	console.log('\t' + colors.red(issues[i].file.name));
		        	for (var j = 0; j < issues[i].errors.length; j++) {
		        		var error = issues[i].errors[j];
		        		if (!error) {continue;}
		        		console.log('\t' + error.reason);
		        		console.log('\t@ line: ' + error.line + ' character: ' + error.character);
		        		console.log('\t' + error.evidence);
		        		console.log('\t' + error.severity);
		        		console.log();
		        	}
		        }
		    }, function () {
		    	// console.log('progress');
		    	bar.tick();
				if (bar.complete) {
					console.log('\ncomplete\n');
				}
		    });

		});
	}
};