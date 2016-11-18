var aws = require('aws-sdk');
aws.config.loadFromPath('./config/aws-config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});
var config = require('./config/config');

exports.handler = function (event, context) {
  var to = event.payload.to;
  var from = event.payload.from||config.sesFromEmailAddress.cortexEmail;
  ses.sendEmail({
      Source: from,
      Destination: {ToAddresses: to},
      Message: {
          Subject: {
              Data: event.payload.subject
          },
          Body: {
              Html: {
                  Data: event.payload.message
              }
          }
      }

  }, function (err, data) {
      if (!err) {
          context.succeed({success:true,result:data});
      }
      else {
          context.fail(JSON.stringify(err));
      }
  });
};
