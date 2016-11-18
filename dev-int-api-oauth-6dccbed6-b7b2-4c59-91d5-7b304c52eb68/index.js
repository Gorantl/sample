process.env.NODE_ENV = process.env.NODE_ENV || "development";

var oauth = require('./oauth/oauth2');
var jwt = require('jsonwebtoken');

var config = require('./config/config.js');

var permissionsDA = require("./utility/da/permissions");
var utility = require('./utility/common/utility');
var userAccesss = require('./utility/da/access');
var users = require('./utility/da/users');

var q = require('q');
var objectID = require("bson-objectid");
var uuid = require('uuid');


exports.handler = function (event, context) {


    var settings = config(event.config);

    if (!event.operation) {
        event.operation = "createToken"
    }
    switch (event.operation) {
        case "createGuestToken":
            createGuestToken();
            break;
        case "verifyToken":
            verifyToken();
            break;
        case "createToken":
            createToken();
            break;

        case "refreshToken":
            refreshToken();
            break;
        case "createEmailToken":
            createEmailToken();
            break;
        // case "verifyEmailToken":
        //     verifyEmailToken();
        //     break;
        default:
            context.fail("Auhentication error");
    }
    function createToken() {

        var req = {
            body: event.payload,
            headers: event.headers,
            user: {ip: event.ip, pageId: event.pageId}
        };

        var res = {
            setHeader: function () {

            },
            end: function (json) {
                context.succeed(json);
            }
        };
        var cb = function (error, data) {
            context.fail(JSON.stringify(error));
        };
        var fail = function (err) {
            context.fail(err);
        };

        req.body.password = req.body.password || req.body.verificationCode;


        var token = oauth.token();
        token(req, res, cb, fail);
    }

    function refreshToken() {

        var req = {
            body: event.payload,
            headers: event.headers,
            user: {ip: event.ip, accountId: event.accountId}
        };

        var res = {
            setHeader: function () {

            },
            end: function (json) {
                context.succeed(json);
            }
        };
        var cb = function (error, data) {
            context.fail(JSON.stringify(error));
        };
        var fail = function (err) {
            context.fail(err);
        };

        //req.body.password = req.body.password || req.body.verificationCode;


        var token = oauth.token();
        token(req, res, cb, fail);
    }

    function verifyToken() {



        try {
            var jwtEncdoe = jwt.verify(event.token, settings.seckey.signature);


            var tokenData = JSON.parse(utility.decrypt(jwtEncdoe.data));

            if (!event.path) {

                console.log('reached');

                var p = [];
                if (tokenData.accessId) {

                    userAccesss.getAccessBag(event.token)
                        .then(function (bagData) {

                            delete bagData.permissions;
                            tokenData.accessBag = bagData;
                            context.succeed({success: true, data: tokenData});
                            return;
                        })
                        .fail(function (err) {

                            context.succeed({success: true, data: tokenData});

                        })
                    return;
                } else {
                    context.succeed({success: true, data: tokenData});
                    return;
                }
            }
            var query = {
                path: event.path,
                httpMethod: event.httpMethod
            };

            var tokenType = tokenData.accessId ? "accessToken" : "clientToken";
            var permissions = "";
            var promise = [];

            if (tokenData.accessId) {
                promise.push(userAccesss.getAccessBag(event.token));
            } else {

                promise.push({});
            }


            promise.push(permissionsDA.getPermission(query));
            q.all(promise)
                .spread(function (userAccessObj, permission) {


                    permissions = permission;
                    if (tokenType == 'clientToken' && permission) {

                        var user = {
                            role: "guest",
                            tokenInfo: tokenData,
                            user: {},
                            access: permissions.access.guest
                        };
                        context.succeed(user);

                    } else {

                        console.log(userAccessObj, 'accesss')
                        if (userAccessObj.activeRole == 'owner' && permissions) {
                            console.log('reahced3')
                            var user = {
                                role: "owner",
                                tokenInfo: tokenData,
                                user: userAccessObj.user,
                                access: permissions.access.owner

                            };

                            context.succeed(user);

                        } else if (userAccessObj.activeRole == "member" && permissions) {
                            console.log('reahced4')
                            var user = {
                                role: "member",
                                tokenInfo: tokenData,
                                user: userAccessObj.user,
                                access: permissions.access.member

                            };
                            context.succeed(user);
                        } else if (userAccessObj.activeRole == "client" && permissions) {
                            console.log('reahced5')
                            var user = {
                                role: "guest",
                                tokenInfo: userAccessObj,
                                user: {},
                                access: permissions.access.guest
                            };
                            context.succeed(user);
                        } else {

                            context.succeed({});
                        }
                    }
                })

                .fail(function (err) {
                    console.log(err, 'error');
                    context.fail(err);
                })
                .done();
        }
        catch (err) {
            console.log(err, 'error');
            err.name = err.name || "EAOA02";
            context.fail(err)

        }
    }


    function createGuestToken() {

        var clientId = uuid.v1(),
            clientSecret = uuid.v4();
        var id = objectID();

        var encryptValue = utility.encrypt(
            JSON.stringify(
                {id: id}
            ));

        var token = jwt.sign({data: encryptValue}, settings.seckey.signature, {expiresIn: 3600000});
        userAccesss.createAccess({
            _id: id,
            type: 'guest',
            token: token,
            clientId: clientId,
            clientSecret: clientSecret,
            app: "web",
            bag: {ip: event.ip},
            ip: event.ip
        })
            .then(function (guestObject) {
                context.succeed({success: true, token: token});
            })
            .fail(function (err) {
                context.fail(err)

            })
            .done();
    }

    function createEmailToken() {


        var id = objectID();

        var encryptValue = utility.encrypt(
            JSON.stringify(
                {id: id}
            ));

        var token = jwt.sign({data: encryptValue}, settings.seckey.signature, {expiresIn: 1800000});

        var p = [];

        users.getUserByEmail({email: event.payload.email})
            .then(function ( userObject) {

                userObject.isAuthenticated =false;
                return userAccesss.createAccess({
                    _id: id,
                    type: 'guest',
                    token: token,
                    app: "web",
                    bag: {ip: event.ip, user:userObject},
                    ip: event.ip
                });

            })
            .then(function (guestObject) {
                context.succeed({success: true, token: token});
            })
            .fail(function (err) {

                context.fail(err)
            })
            .done();
    }

    // function verifyEmailToken(){
    //
    //     try {
    //
    //         var jwtEncdoe = jwt.verify(event.payload.token, settings.seckey.signature);
    //
    //
    //         var tokenData = JSON.parse(utility.decrypt(jwtEncdoe.data));
    //
    //         userAccesss.getAccessBag(event.payload.token)
    //             .then(function (bagData) {
    //                 tokenData.accessBag = bagData;
    //                 if (bagData.user && bagData.user.isAuthenticated == 'true') {
    //                     var p = [];
    //                     var id = objectID();
    //
    //                     var encryptValue = utility.encrypt(
    //                         JSON.stringify(
    //                             {id: id}
    //                         ));
    //
    //                     var token = jwt.sign({data: encryptValue}, settings.seckey.signature, {expiresIn: 1800000});
    //                     p.push(userAccesss.createAccess({
    //                         _id: id,
    //                         token: token,
    //                         app: "web",
    //                         bag: {ip: event.ip, user: {email: event.payload.email, isAuthenticated: "true"}},
    //                         ip: event.ip
    //                     }));
    //
    //                     p.push({});
    //
    //                 } else {
    //
    //                 }
    //                 context.succeed({success: true, data: tokenData});
    //                 return;
    //             })
    //             .fail(function (err) {
    //
    //                 context.succeed({success: true, data: tokenData});
    //
    //             });
    //     }
    //
    //
    //
    // }

};
