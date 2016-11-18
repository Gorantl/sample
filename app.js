var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.listen(3000,function(){
  console.log('server started');
})

console.log('changes for merge');
console.log('changes for merge.......2');
console.log('changes for merge.......3');

console.log('changes for merge.......4');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var obj = {};
obj.hashTag = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ODA3NmZlMzg1MGNlMjI5NzMyYmIwZTQiLCJuYW1lIjoibmV3dGFnbiIsImlhdCI6MTQ3Njg4MjQwM30.7-5kP7P-tcruGMhLeZEuvPBvqEIhn8O7P102_FvGWPI",
    "name": "NewTagN",
    "audience": "public",
    "backgroundColor": "ctx-blu-grdt-bg",
    "connect": "anyone",
    "imageUrl": "",
    "category": "Events",
    "accountId": "58076fe3850ce229732bb0e4",
    "hashTag": "newtagn",
    "info": null,
    "status": "approved",
    "shortUrlId": "V14WkwekG",
    "shortUrl": "https://willu.io/V14WkwekG",
    "id": "58076fe3850ce229732bb0e5",
    "followers": {
        "total": 3,
        "newFollowers": 0
    },
    "newMessages": 0,
    "newResponses": 0
};
var obj2 =  {
    hashTag :{
        "hashTag":"testingconversation",
        "name":"testingconversation",
        "audience":"public",
        "backgroundColor":"ctl-blu-card",
        "connect":"justme",
        "imageUrl":"D3ZrzJ3y",
        "accountId":"57d94b9dc90cfd291b460d3e",
        "info":null,
        "status":"approved",
        "shortUrlId":"NJfy13bpZ",
        "shortUrl":"https://willu.io/NJfy13bpZ",
        "id":"57e8bfc1aeff5b2478c520ad",
        "success":true
    }
}

app.render('hashtag',obj2,function(err,html){
   if(err){
console.log('eeeeeeeeee');
       console.log(err);
   } else{
       console.log('rrrrrrr');
      // console.log(html);
       var webshot = require('webshot');

       var options = {
           screenSize: {
               width: 200
               , height: 200
           },

           siteType:'html'

           , shotSize: {
               width: 320
               , height: 'all'
           }
           , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
           + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
       };

       webshot(html, 'html10.png',{siteType:'html'}, function(err) {
           // screenshot now saved to google.png
       });
   }
});



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
