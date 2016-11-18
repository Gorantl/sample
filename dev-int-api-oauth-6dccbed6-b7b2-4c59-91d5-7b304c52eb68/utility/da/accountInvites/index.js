/**
 * Created by Dheeraj on 24/06/16.
 */


var accountInvites = require('./accountInvites.da.js');


exports.getInviteByUserId = function (userId) {

    return accountInvites.getInviteByUserId(userId);

};
