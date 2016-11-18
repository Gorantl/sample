/**
 * Created by SELOTSOFT on 06/06/15.
 */



var request = require('request'),
    config = require('../../../config/config'),
    q = require('q');

exports.getScopeByUserId = function (userId, role) {

    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/users/" + userId+"/scope",
        method: "GET",
        qs:{role: role},
        useQuerystring: true
    }, function (err, response, body) {
        
        
        if (!err && response.statusCode == 200) {
           var response= JSON.parse(body);
            if(response.success==true){
                
                deferred.resolve(JSON.parse(body));
            }else{
                deferred.resolve(null);
            }

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

exports.getScopeByAccountId  = function (userId, accountId) {

    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/users/" + userId + "/scope/account",
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


exports.createScope = function (userId, scope) {

    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/users/" + userId + "/scope",
        method: "POST",
        json: scope
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


exports.getUserByEmail = function (query) {

    var settings = config();
    var deferred = q.defer();

    console.log(settings.ctxDa.url);
    request({
        url: settings.ctxDa.url + "/users/email",
        method: "GET",
        qs:query,
        useQuerystring: true
    }, function (err, response, body) {

        console.log(body,'body')
        if (!err && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
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