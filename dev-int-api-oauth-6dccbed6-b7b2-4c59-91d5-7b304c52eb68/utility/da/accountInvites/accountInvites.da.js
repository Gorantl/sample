/**
 * Created by Dheeraj on 24/06/16.
 */

var request = require('request'),
    config = require('../../../config/config'),
    q = require('q');

exports.getInviteByUserId = function (userId) {

    var settings = config();
    var deferred = q.defer();
    request({
        url: settings.ctxDa.url + "/account/invite/user/"+ userId,
        method: "GET"

    }, function (err, response, body) {

        if(!err){
            var result =JSON.parse(body);
        
            if(result.success == true){
                
                deferred.resolve(result);
            }else {
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