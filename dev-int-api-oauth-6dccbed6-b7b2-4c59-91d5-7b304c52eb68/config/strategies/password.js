///**
// * Created by Dheeraj on 30/05/15.
// */

var passport = require('passport');
var clientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    client = require('./../../utility/da/clientAccess/clientAccess.da.js'),
    parser = require('ua-parser-js');
    scopes = require('./../../utility/da/scopes/scopes.da.js');


passport.use(new clientPasswordStrategy(
    {
        passReqToCallback: true
    },
    function (req, clientId, clientSecret, done) {

        var ua = parser(req.headers['user-agent']);
        //console.log(ua);
            ua.accept_language =req.headers["accept-language"];
            ua.ip = req.ip;


        client.getClinetByClientId({clientId: clientId, clientSecret: clientSecret})
            .then(
            function (client) {

                if (client.clientSecret == clientSecret) {
                    client.tagId = req.body.tagId;

                   // console.log(client);

                    ua.ip = client.bag.ipAddress || req.ip;
                    client["userAgent"] = ua;

                    console.log(done);
                    done(null, client);
                    console.log(client);
                }
                else {
                    console.log('false');
                    done(false);
                }
            }).fail(function (err) {

                done(err);
            })
            .done();
    }));

