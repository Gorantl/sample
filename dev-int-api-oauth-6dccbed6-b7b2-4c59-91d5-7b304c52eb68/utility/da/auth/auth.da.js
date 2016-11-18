/**
 * Created by Selotsoft on 29/03/15.
 */


var config = require('../../../config/config.js'),
    q = require('q'),
    request = require('request');


exports.login = function (userObject) {
    var settings = config();

        var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/auth/login",
        method: "POST",
        json: userObject,
        headers: {"Content-Type": "application/json"}
    }, function (err, response, body) {


        if (!err && response.statusCode == 200 ) {
            deferred.resolve(body);
        }
        else {
            if (err)
                deferred.reject(err);
            else
             
                deferred.reject(body);
        }
    });

    return deferred.promise;

};