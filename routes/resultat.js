var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: "./uploads/"});
var fs = require('file-system');
var pg = require("pg");

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = new pg.Client(req.app.get('connexion'));
    client.connect();
  client.query("SELECT * FROM file_table INNER JOIN result ON file_table.id = result.idFile WHERE file_table.iduser="+req.session.idd+" AND idresult = "+req.query.idResult,
      function(err, readResult) {
          console.log('err',err,'pg readResult');
          res.render('resultat', { row : readResult.rows[0], id: req.session.idd });
          fs.writeFile('./uploads/'+req.session.idd+"/data.csv", readResult.rows[0].data,function(err) {
              console.error("write error:  " + err);
              res.render('resultat', { title: '' });
          });
          fs.unlink('./uploads/'+req.session.idd+"/data.csv");

      });
});

module.exports = router;
