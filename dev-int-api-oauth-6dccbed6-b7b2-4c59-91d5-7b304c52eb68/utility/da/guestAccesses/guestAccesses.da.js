/**
 * Created by Dheeraj on 05/06/15.
 */


var request = require('request'),
    config = require('../../../config/config'),
    q = require('q');


exports.createGuestAccesses = function (clientAccessObject) {
    
    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/guestaccesses",
        method: "POST",
        json: clientAccessObject
    }, function (err, response, body) {

        if (!err && response.statusCode == 201) {

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


exports.getGuestAccessById = function (guestId) {
    
    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/guestaccesses/"+ guestId,
        method: "GET"

    }, function (err, response, body) {

        if (!err && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
        }
        else {
            if (err)
                deferred.reject(err);
            else
                deferred.reject(JSON.parse(body));
        }
    });

    return deferred.promise;

};