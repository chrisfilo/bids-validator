var async  = require('async');
var utils  = require('../utils');

var TSV    = require('./tsv');
var JSON   = require('./json');
var NIFTI  = require('./nii');

/**
 * BIDS
 *
 * Takes either a filelist array or
 * a path to a BIDS directory and
 * starts the validation process and
 * returns the errors as an argument
 * to the callback.
 */
module.exports = function (fileList, callback, progress) {
    if (typeof fileList === 'object') {
        start(fileList, callback, progress);
    } else if (typeof fileList === 'string') {
        utils.readDir(fileList, function (files) {
            start(files, callback, progress);
        });
    }
};

/**
 * Start
 *
 * Takes on an array of files and starts
 * the validation process for a BIDS
 * package.
 */
function start (fileList, callback, progress) {
    var errors = [];
    async.forEachOf(fileList, function (file, key, cb) {

        // validate NifTi
        if (file.name && file.name.indexOf('.nii') > -1) {

            // check if NifTi is gzipped
            if (file.name.indexOf('.gz') === -1) {
                var newError = {
                    evidence: file.name,
                    line: null,
                    character: null,
                    reason: 'NifTi files should be compressed using gzip.',
                    severity: 'warning'
                }
                errors.push({file: file, errors: [newError]});
            }

            // Psuedo-Code for validating NifTi header
            // utils.readFileHeader(file, function (header) {
            //     NIFTI(header, function (errs) {
            //         if (errs) {
            //             errors.push({file: file, errors: errs});
            //         }
            //     });
            // });

            cb();
            progress();
            return;
        }

        // validate tsv
        if (file.name && file.name.indexOf('.tsv') > -1) {
         utils.readFile(file, function (contents) {
             TSV(contents, function (errs) {
                    if (errs) {
                        errors.push({file: file, errors: errs})
                    }
                    cb();
                    progress();
                });
         });
            return;
        }

        // validate json
        if (file.name && file.name.indexOf('.json') > -1) {
            utils.readFile(file, function (contents) {
                JSON(contents, function (errs) {
                    if (errs) {
                        errors.push({file: file, errors: errs})
                    }
                    cb();
                    progress();
                });
            });
        } else {
            cb();
            progress();
        }
    
    }, function () {
        callback(errors);
    });
}