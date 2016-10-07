var pg = require("pg");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/login', function(req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();

    var query = client.query("SELECT * FROM users WHERE login='"+req.query.username+"' AND password='"+req.query.password+"'");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        console.log(JSON.stringify(result.rows, null, "    "));
        if(result.rows.length>0) {
            client.end();
            res.redirect("/index");
        } else {
            client.end();
            res.redirect("/");
        }


    });
});

module.exports = router;
