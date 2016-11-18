/**
 * Created by Selotsoft on 04/04/15.
 */
var accessDa = require("./access.da.js");


exports.createAccess = function(accessObject) {

  return  accessDa.createAccess(accessObject);
};

exports.updateAccessBag = function(accessId, bag ) {

  return  accessDa.updateAccessBag(accessId, bag);
};

exports.deleteAccessBag = function(accessId, bag ) {

  return  accessDa.deleteAccessBag(accessId, bag);
};

exports.getAccessBag = function(token ,query) {

  return  accessDa.getAccessBag(token,query);
};

