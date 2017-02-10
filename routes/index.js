var express = require('express');
var router = express.Router();
var pg = require("pg");

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = new pg.Client(req.app.get('connexion'));
  client.connect();
  console.log(req.session.idd);
  client.query("SELECT * FROM file_table INNER JOIN result ON file_table.id = result.idFile WHERE file_table.iduser="+req.session.idd,
      function(err, readResult) {
        console.log('err',err,'pg readResult');
        res.render('index',  { rows: readResult.rows, idUser : req.session.id});
      });

});

router.get('/reset', function(req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    console.log(req.session.idd);
    client.query("DELETE FROM result r USING file_table ft WHERE ft.id = r.idFile AND ft.iduser="+req.session.idd,
        function(err, readResult) {
            console.log("delete");
            console.log('err',err,'pg readResult');
            res.redirect("/index");
        });

});

module.exports = router;
