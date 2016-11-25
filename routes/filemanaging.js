var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: "./uploads/"});
var fs = require('file-system');
var pg = require("pg");


/* GET filemanaging page. */
router.get('/', function(req, res, next) {
    console.log("TEST USERNAME " + global.username);
    //upload.dest="./uploads/"+global.username;
    res.render('filemanaging', { title: '' });
});
router.post('/add', upload.any(), function(req, res, next) {
    //console.log(req);
    console.log(req.files);
    //console.log(req.body);
    fs.readFile("./uploads/"+req.files[0].filename, 'hex', function(err, apk) {
        fs.readFile("./uploads/"+req.files[1].filename, 'hex', function(err, apkTest) {
            fs.readFile("./uploads/"+req.files[2].filename, 'hex', function(err, manifest) {
                var client = new pg.Client(req.app.get('connexion'));
                client.connect();
                apk = '\\x' + apk;
                apkTest = '\\x' + apkTest;
                manifest = '\\x' + manifest;
                client.query('insert into file_table (idUser,dataapk,filenameapk,filenameapktest,datamanifest,dataapktest,filenamemanifest) values ($1,$2,$3,$4,$5,$6,$7)',
                    [global.id,apk, req.files[0].originalname, req.files[1].originalname,manifest,apkTest,req.files[2].originalname],
                    function(err, writeResult) {
                        console.log('err',err,'pg writeResult',writeResult);
                        fs.unlink("./uploads/"+req.files[0].filename);
                        fs.unlink("./uploads/"+req.files[1].filename);
                        fs.unlink("./uploads/"+req.files[2].filename);
                        res.redirect("/filemanaging");
                    });
            });
        });

    });
});
module.exports = router;
