var validate = require('./index.js');
var colors = require('colors/safe');
var ProgressBar = require('progress');

module.exports = function (args) {


	var bar = new ProgressBar(':bar', { total: 10 });
	var timer = setInterval(function () {
		bar.tick();
		if (bar.complete) {
			console.log('\ncomplete\n');
			clearInterval(timer);
		}
	}, 100);

	// var dir  = args[2];

	// if (dir) {
	//     validate.BIDS(dir, function (issues) {
	//         console.log();
	//         for (var i = 0; i < issues.length; i++) {
	//         	console.log('\t' + colors.red(issues[i].file.name));
	//         	for (var j = 0; j < issues[i].errors.length; j++) {
	//         		var error = issues[i].errors[j];
	//         		if (!error) {continue;}
	//         		console.log('\t' + error.reason);
	//         		console.log('\t@ line: ' + error.line + ' character: ' + error.character);
	//         		console.log('\t' + error.evidence);
	//         		console.log('\t' + error.severity);
	//         		console.log();
	//         	}
	//         }
	//     });
	// }
};