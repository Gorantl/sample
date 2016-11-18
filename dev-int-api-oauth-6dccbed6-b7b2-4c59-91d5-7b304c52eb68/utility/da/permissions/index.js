/**
 * Created by Dheeraj on 05/06/15.
 */



var permissions = require('./permissions.da.js');


exports.getPermission = function (query) {

   return permissions.permission(query);

};

