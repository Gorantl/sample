/**
 * Created by Selotsoft on 06/06/15.
 */


var request = require('request'),
    config = require('../../../config/config'),
    q = require('q');

exports.createAccess = function (newAccess) {
    
    var settings = config();

    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/accesses",
        method: "POST",
        json: newAccess
    }, function (error, response, body) {



        if (!error && response.statusCode == 201) {

            deferred.resolve(body);
        }
        else {
            if (error)
                deferred.reject(error);
            else
                deferred.reject(body);
        }

    });

    return deferred.promise;

};


 

exports.updateAccessBag = function (token, bag) {

    var deferred = q.defer();
    var settings = config();
    request({
        url: settings.ctxDa.url + "/accesses/" + token + "/bag",
        method: "POST",
        json: bag

    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        }
        else {
            if (error)
                deferred.reject(error);
            else
                deferred.reject(body);
        }

    });

    return deferred.promise;

};

exports.updateAccessBag = function (token, accessId) {

    var deferred = q.defer();
    var settings = config();
    request({
        url: settings.ctxDa.url + "/accesses/" + token + "/bag",
        method: "DELETE",
        json: {accessId:accessId}

    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        }
        else {
            if (error)
                deferred.reject(error);
            else
                deferred.reject(body);
        }

    });

    return deferred.promise;

};

exports.getAccessBag = function (token, query) {
    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/accesses/" + token + "/bag",
        method: "GET",
        qs:query,
        useQuerystring: true
    }, function (error, response, body) {
        
        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
        }
        else {
            if (error)
                deferred.reject(error);
            else
                deferred.reject(body);
        }
    });
    return deferred.promise;
};


 