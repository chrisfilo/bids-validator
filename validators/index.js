// dependencies ------------------------------------------------------

var async  = require('async');
var utils  = require('../utils');

var TSV    = require('./tsv');
var JSON   = require('./json');
var NIFTI  = require('./nii');
var BIDS   = require('./bids');

// public api --------------------------------------------------------

var validate = {
	BIDS: BIDS,
	BIDSPath: BIDSPath,
	JSON: JSON,
	TSV: TSV,
	NIFTI: NIFTI
};

// implementations ---------------------------------------------------


function BIDSPath (path, callback, progress) {
    utils.readDir(path, function (files) {
        BIDS(files, function (errors) {
            callback(errors);
        }, progress);
    });
}



// exports -----------------------------------------------------------

module.exports = validate;