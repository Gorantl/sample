/**
 * Created by Dheeraj on 05/06/15.
 */



var guestAccesses = require('./guestAccesses.da.js');


exports.createGuestAccesses = function (guestObject) {

   return guestAccesses.createGuestAccesses(guestObject);

};


exports.getGuestAccessById = function (guestId) {

    return guestAccesses.getGuestAccessById(guestId);

};