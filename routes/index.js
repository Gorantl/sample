var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: './public/uploads/'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/index', function(req, res, next) {
    var obj = {};
    obj.hashtags = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ODA3NmZlMzg1MGNlMjI5NzMyYmIwZTQiLCJuYW1lIjoibmV3dGFnbiIsImlhdCI6MTQ3Njg4MjQwM30.7-5kP7P-tcruGMhLeZEuvPBvqEIhn8O7P102_FvGWPI',
        name: 'NewTagN',
        audience: 'public',
        backgroundColor: 'ctx-blu-grdt-bg',
        connect: 'anyone',
        imageUrl: '',
        category: 'Events',
        accountId: "58076fe3850ce229732bb0e4",
        hashTag: 'newtagn',
        info: null,
        status: 'approved',
        shortUrlId: 'V14WkwekG',
        shortUrl: 'https://willu.io/V14WkwekG',
        id: '58076fe3850ce229732bb0e5',
        followers: { total: 3, newFollowers: 0 },
        newMessages: 0,
        newResponses: 0 }
    res.render('hashtag', obj);
});
router.post('/',upload.any(), function(req, res, next) {
  var csv = require('fast-csv');
  var fs = require('file-system');
  var emails = [];
  var path = req.files[0].path;

  var stream = fs.createReadStream(path);
  csv
      .fromStream(stream,{headers : true})
      .on("data", function(data){
      //  console.log(data);

        if(data.email == 'email'){

        }else {
          emails.push(data.email);
        }
        console.log('....array of gmails');
        console.log(emails);
      })
      .on("end", function(){
        console.log("done");
        var obj={};
        obj.emails = emails;
        res.render('csv',obj);
      });
});

module.exports = router;
