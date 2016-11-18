/**
 * Created by Dheeraj on 08/06/15.
 */
var errorCodes = require('./errorCodes.json');

exports.handle = function (err) {

    if (err.status == undefined) {
        err.status = 500;
    }

    var array = [];
    if (Array.isArray(err)) {
        for (var i = 0; i < err.length; i++) {

            var name = err[i].name || err[i].errorCode;
            var error = errorCodes[name];
            array.push(error);
        }
        return {status: 400, errorCodes: array};
    } else {
        var name = err.name || err.errorCode;
        return  errorCodes[name];


    }

};