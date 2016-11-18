/**
 * Created by Selotsoft on 29/03/15.
 */

var users = require('../users'),
    auth = require('./auth.da.js'),
    accountInvites = require('../accountInvites'),
    q = require('q'),
    access = require('../access'),
    utility = require('../../common/utility'),
    jwt = require('jsonwebtoken'),
    ip = require('../../extApi/ipLocation'),
    objectID = require("bson-objectid"),
    config = require('../../../config/config');


exports.validateUser = function (userObject, client) {

    var settings = config();
    var err = new Error();
    var user, owner, accountScopesObject;
    var locationDetail;
    var prom = [];
    var token;
    var accountInvite;
    
    return auth.login({username: userObject.username, password: userObject.password})
        .then(function (userResult) {

            user = userResult;
            if (client && client.accountId) {
                prom.push(users.getScopeByAccouId(user.id, client.accountId));
            }
            else {
                prom.push({});
            }
            prom.push(users.getScopeByUserId(user.id, 'owner'));

            if (client && client.userAgent && client.userAgent.ip) {
                prom.push(ip.getLocationByIP(client.userAgent.ip));
            } else {
                prom.push({});
            }
            prom.push(accountInvites.getInviteByUserId(user.id));
            return prom;

        })
        .spread(function (accountScopes, ownerScope, locationResult, inviteObject) {
            accountInvite = inviteObject || {};
            
            accountScopesObject = accountScopes;

            owner = ownerScope;

            if (!locationResult) {
                locationDetail = {};
            } else {
                locationDetail = {
                    "latitude": locationResult.lat,
                    "longitude": locationResult.lon,
                    "city": locationResult.city,
                    "state": locationResult.regionName,
                    "country": locationResult.country
                };
            }

            if (owner == null && (!client || !client.accountId)) {
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
        .then(function (ownerScope) {
            // owner object is empty means user and account is not populated
            if (owner == null && client && !client.accountId) {
                return users.getScopeByUserId(user.id, 'owner');
            }
            else {
                return ownerScope;
            }
        })
        .then(function (scopeResult) {

            owner = scopeResult;
            var device = {};
            //device = {
            //    type: client.userAgent.device.type,
            //    resolution: "",
            //    browser: client.userAgent.browser.name,
            //    os: client.userAgent.os.name,
            //    model: client.userAgent.device.model,
            //    ip: client.userAgent.ip,
            //    macAddress: '',
            //    location: '',
            //    culture: client.userAgent.accept_language
            //};
            //  scopeResult.accountId.role = scopeResult.role;
            if (!owner.accountId) {
                owner.accountId = {};
            }
            if (owner != null) {

                owner.accountId = owner.accountId || null;
                owner.accountId.role = owner.accountId.role || "owner";
                owner.accountId.isOwner = true;
            }
            else {
                delete  accountScopesObject.accountId;
                owner = accountScopesObject;
            }


            if (!accountScopesObject) {

                accountScopesObject = {};
            }
            

            var id = objectID();
            var newAccess = {
                _id: id,
                scopeId: owner.id,
                role: owner.role,
                devices: device,
                bag: {
                    accountInvite: accountInvite.status || null ,
                    location: locationDetail,
                    activeRole: accountScopesObject.role || owner.role,
                    scopes: {},
                    user: user,
                    account: owner.accountId,
                    "defaults": {
                        "languages": {
                            "language": "English",
                            "abbr": "en"
                        }
                    }
                    //permissions: scopeResult.permissions
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
            return access.createAccess(newAccess);
        })
        .then(function (accessResult) {

            return token;
        });

};
 