var config = require('./config.js'),
    appValidator = require('./appValidator.js');
        var q = require('q');

// Twilio Credentials
var accountSid = config.twilio.accountSid,
    authToken = config.twilio.authToken,
    fromNumber = config.twilio.twilioNumber; // config.twilio.testTwilioNumber

var twilio = require('twilio')(accountSid, authToken);
// var testTwilio = require('twilio')(config.twilio.testAccountSid, config.twilio.testAuthToken);
var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(accountSid, authToken);

exports.handler = function (event, context) {

var operation = event.operation;
switch (operation) {
  case 'bulksms':
        event.payload.from = event.payload.from || fromNumber;
        //var toaddresses = event.payload.to;
        var p =[];
        // toaddresses.forEach(function(address){
            event.payload.to = "+918897573340","+919964485797","+919964485797";//address;

             //validateSendMessage(event.payload, context);
             p.push(twilio.messages.create(event.payload));
        // });
      q.all(p)
          .then(function (twilioRes) {
              console.log('then')
              context.succeed({ success: true ,result:twilioRes });
          })
          .fail(function (err) {
              console.log('fail',err)
              context.succeed({ success: false , error:err});
          })
          .catch(function (ex) {
              console.log(ex)
              context.succeed({ success: false , error:ex});
          })

    break;

  default:
    context.fail(new Error('Unrecognized operation "' + operation + '"'));
  }
};

function validateSendMessage(obj,context){
  var errors = [];
  obj.to = obj.to || '';
  obj.body = obj.body || '';
  errors = appValidator(obj.to, ['required'], ['EETW03'], errors);
  errors = appValidator(obj.body, ['required'], ['EETW04'], errors);
  if (errors.length > 0) {
      context.fail(new Error(JSON.stringify(errors)));
  }
}

function validateGeneratePhoneNumber(obj,context){
  var errors = [];
  obj.phoneNumber = obj.phoneNumber || '';
  errors = appValidator(obj.phoneNumber, ['required'], ['EETW03'], errors);
  if (errors.length > 0) {
      context.fail(new Error(JSON.stringify(errors)));
  }
}

function validateGetMobileInfo(obj,context){
  var errors = [];
  obj.mobile = obj.mobile || '';
  errors = appValidator(obj.mobile, ['required'], ['EETW08'], errors);
  if (errors.length > 0) {
      context.fail(new Error(JSON.stringify(errors)));
  }
}
