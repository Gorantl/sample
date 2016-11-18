/**
 * Created by Dheeraj on 03/10/15.
 */

var config = require('../../../config/config.js'),
    q = require('q'),
    request = require('request');

exports.getLocationByIP = function (IP) {

    var deferred = q.defer();
    request({
        url: config.ctxExt.url + "/iplocation/" + IP,
        method: "GET"

    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
        }
        else {
            if (error)
                deferred.reject(error);
            else
                deferred.reject(JSON.parse(body));
        }
    });

    return deferred.promise;

};

