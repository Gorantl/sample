//    utility = require('../../utility/common/utility');
/**
 * Created by Selotsoft.
 */

var oauth2orize = require('oauth2orize');
var users = require('./../utility/da/users');
var auth = require('./../utility/da/auth');
var userAccess = require('./../utility/da/access');
var objectID = require("bson-objectid");
var accountInvites = require('./../utility/da/accountInvites');
var utility = require('./../utility/common/utility');
 var   jwt = require('jsonwebtoken');
server = oauth2orize.createServer();
var config = require('../config/config');

server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, next) {

    var userObject = {
        username: username,
        password: password
    };
    //console.log(userObject)

    auth.validateUser(userObject, client)
        .then(function (loginResult) {

            next(null, loginResult, {success: true});
        })
        .fail(function (err) {
            //console.log(err);
            var error = new oauth2orize.AuthorizationError(err.errorCode, err.errorCode, null, err.status);

            next(err, {success: false}, {success: true});
        })
        .catch(function (err) {
            next(err);

        })
        .done();
}));


server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, next) {

    var settings = config();
    var user, accountInvite, owner,token;

    try {

        var jwtEncdoe = jwt.verify(refreshToken, settings.seckey.signature);



        var tokenData = JSON.parse(utility.decrypt(jwtEncdoe.data));
        userAccess.getAccessBag(refreshToken, {type: 'guest'})
            .then(function (bagData) {

                if (bagData.user && bagData.user.isAuthenticated == false) {
                    user =bagData.user;
                    var p = [];
                    p.push(users.getScopeByUserId(bagData.user.id, 'owner'));
                    p.push(accountInvites.getInviteByUserId(bagData.user.id));
                    return p;

                }else{

                    throw new Error();
                }
            })
            .spread(function (ownerScope, inviteObject) {
                accountInvite = inviteObject || {};
                owner = ownerScope;


                if (owner == null) {
                    var scope = {
                        userId: user.id,
                        role: "owner"
                    };
                    return users.createScope(user.id, scope);
                }
                else {
                    // return existing owner scope
                    return owner;
                }
            })
            .then(function (scopeResult) {

                owner = scopeResult;
                var device = {};

                if (!owner.accountId) {
                    owner.accountId = {};


                } else {
                    owner.accountId = owner.accountId || null;
                    owner.accountId.role = owner.accountId.role || "owner";
                    owner.accountId.isOwner = true;
                }


                var id = objectID();
                var newAccess = {
                    _id: id,
                    scopeId: owner.id,
                    role: owner.role,
                    bag: {
                        accountInvite: accountInvite.status || null,
                        activeRole: owner.role,
                        user: user,
                        scopes: {},
                        account: owner.accountId,
                        "defaults": {
                            "languages": {
                                "language": "English",
                                "abbr": "en"
                            }
                        }

                    }
                };

                if (Object.keys(newAccess.bag.scopes).length == 0) {
                    newAccess.bag.scopes['accountId'] = " ";
                }
                var encryptValue = utility.encrypt(
                    JSON.stringify(
                        {"accessId": id}
                    ));

                var iat = Math.floor(Date.now());
                token = jwt.sign({data: encryptValue, iat: iat}, settings.seckey.signature, {expiresIn: 3600000});
                newAccess.token = token;
                return userAccess.createAccess(newAccess);
            })
            .then(function (accessResult) {

                next(null, token , {success: true});
            })
            .fail(function (err) {


                //console.log(err);
                var error = new oauth2orize.AuthorizationError(err.errorCode, err.errorCode, null, err.status);

                next(err, {success: false}, {success: true});
            })
            .catch(function (err) {
                next(err);

            })
            .done();
    }
    catch (ex) {
        console.log(ex);
    }


}));

module.exports = server;
