/**
 * Created by SELOTSOFT on 25/05/15.
 */


var crypto = require('crypto'),
    config = require('../../config/config');


exports.encrypt = function (text) {

    var seetings= config();
    var cipher = crypto.createCipher(seetings.seckey.algorithm, seetings.seckey.cryptPass);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};


exports.decrypt = function (text) {
    var seetings = config();
    var decipher = crypto.createDecipher(seetings.seckey.algorithm, seetings.seckey.cryptPass);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};
