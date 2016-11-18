/**
 * Created by Dheeraj on 05/06/15.
 */


var request = require('request'),
    config = require('../../../config/config'),
    q = require('q');


exports.permission = function (query) {
    
    var settings = config();
    var deferred = q.defer();
    console.log(query)
   
    request({
        url: settings.ctxDa.url + "/permissions",
        method: "GET",
        qs: query,
        useQuerystring: true
    }, function (err, response, body) {
        
        console.log(body)
    
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
