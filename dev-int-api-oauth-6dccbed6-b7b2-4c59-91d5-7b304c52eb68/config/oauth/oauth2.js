/**
 * Created by Selotsoft.
 */

var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    users = require('../../utility/da/users');




var server = oauth2orize.createServer();


server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, next) {

        var userObject = {
            username: username,
            password: password
        };
        users.loginForOwner(userObject, client)
            .then(function (loginResult) {
                next(null, loginResult, {success: true});
            })
            .fail(function (err) {
                //console.log(err);
                var error = new oauth2orize.AuthorizationError(err.errorCode, err.errorCode, null, err.status);
                next(err);
            })
            .catch(function (err) {
                next(err);

            })
            .done();
    }));

//server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, next) {
//
//
//    var tokenData = jwt.decode(refreshToken, {complete: true});
//    var date = new Date();
//
//        date =date.setMinutes(date.getMinutes() + 30);
//    var expDate = new Date(tokenData.exp);
//    //console.log(new Date(tokenData.exp));
//    expDate = expDate.setMinutes(expDate.getMinutes() + 30);
//
//    console.log(expDate);
//    console.log(date);
//    console.log(expDate <= date);
//
//    if (expDate <= date) {
//        var expires = new Date().setMinutes(new Date().getMinutes() + 60);
//        token = jwt.sign({data: tokenData.data}, config.seckey.signature, {expiresInMinutes: 60});
//        access.updateToken(tokenData.data.accessId, {token: token, expiresAt: expires});
//
//        next(null, token, refreshToken, {expires_in: expires});
//
//    }
//
//
//}));
//
//exports.token = [
//    passport.authenticate(['oauth2-client-password'], {session: false}),
//    server.token()
//
//];

