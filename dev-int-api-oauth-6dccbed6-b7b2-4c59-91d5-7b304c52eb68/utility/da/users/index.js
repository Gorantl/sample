/**
 * Created by Dheeraj on 09/06/16.
 */

var usersDa = require("./users.da.js");

exports.getScopeByUserId = function (userId, role) {

    return usersDa.getScopeByUserId(userId,role);

};

exports.getScopeByAccouId = function (userId, accountId) {

    return usersDa.getScopeByAccouId(userId, accountId)
        .then(function (scopesResult) {

            if (scopesResult.success == false) {
                var scope = {
                    userId: userId,
                    accountId: accountId,
                    role: "member"

                };
                return usersDa.createScope(scope)
                    .then(function (newScopeResult) {

                        return usersDa.getScopeByAccountId(userId, accountId);
                    })
            }
            return scopesResult;
        })
};
exports.createScope = function (userId,scope) {
    

    return usersDa.createScope(userId,scope);

};

exports.getUserByEmail = function (query) {


    return usersDa.getUserByEmail(query);

};

