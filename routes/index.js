var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: './public/uploads/'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
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
