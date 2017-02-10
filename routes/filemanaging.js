var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: "./uploads/"});
var fs = require('file-system');
var pg = require("pg");


/* GET filemanaging page. */
router.get('/', function(req, res, next) {
    //upload.dest="./uploads/"+global.username;
    res.render('filemanaging', { title: '' });
});
router.post('/add', upload.any(), function(req, res, next) {
    console.log(req.files.length);
    if(req.files.length==4) {
        fs.readFile("./uploads/" + req.files[0].filename, 'hex', function (err, apk) {
            fs.readFile("./uploads/" + req.files[1].filename, 'hex', function (err, apkTest) {
                fs.readFile("./uploads/" + req.files[2].filename, 'hex', function (err, manifest) {
                    fs.readFile("./uploads/" + req.files[3].filename, 'hex', function (err, manifestAndroid) {
                        var client = new pg.Client(req.app.get('connexion'));
                        client.connect();
                        apk = '\\x' + apk;
                        apkTest = '\\x' + apkTest;
                        manifest = '\\x' + manifest;
                        manifestAndroid = '\\x' + manifestAndroid;
                        console.log(req.files[0].originalname + " " + req.files[1].originalname + " " + req.files[2].originalname + " " + req.files[3].originalname);
                        client.query('insert into file_table (idUser,dataapk,filenameapk,filenameapktest,datamanifest,dataapktest,filenamemanifest, datamanifestandroid, filenamemanifestandroid) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                            [req.session.idd, apk, req.files[0].originalname, req.files[1].originalname, manifest, apkTest, req.files[2].originalname, manifestAndroid, req.files[3].originalname],
                            function (err, writeResult) {
                                console.log('err', err, 'pg writeResult', writeResult);
                                fs.unlink("./uploads/" + req.files[0].filename);
                                fs.unlink("./uploads/" + req.files[1].filename);
                                fs.unlink("./uploads/" + req.files[2].filename);
                                fs.unlink("./uploads/" + req.files[3].filename);
                                res.redirect("/filemanaging");
                            });
                    });
                });
            });

        });
    } else if(req.files.length==3) {
        fs.readFile("./uploads/" + req.files[0].filename, 'hex', function (err, apk) {
            fs.readFile("./uploads/" + req.files[1].filename, 'hex', function (err, apkTest) {
                fs.readFile("./uploads/" + req.files[2].filename, 'hex', function (err, manifest) {
                        var client = new pg.Client(req.app.get('connexion'));
                        client.connect();
                        apk = '\\x' + apk;
                        apkTest = '\\x' + apkTest;
                        manifest = '\\x' + manifest;
                        client.query('insert into file_table (idUser,dataapk,filenameapk,filenameapktest,datamanifest,dataapktest,filenamemanifest, datamanifestandroid, filenamemanifestandroid) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                            [req.session.idd, apk, req.files[0].originalname, req.files[1].originalname, manifest, apkTest, req.files[2].originalname, "", ""],
                            function (err, writeResult) {
                                console.log('err', err, 'pg writeResult', writeResult);
                                fs.unlink("./uploads/" + req.files[0].filename);
                                fs.unlink("./uploads/" + req.files[1].filename);
                                fs.unlink("./uploads/" + req.files[2].filename);
                                res.redirect("/filemanaging");
                            });
                    });
                });
            });
    } else if(req.files.length==2) {
        fs.readFile("./uploads/" + req.files[0].filename, 'hex', function (err, apk) {
            fs.readFile("./uploads/" + req.files[1].filename, 'hex', function (err, manifestAndroid) {
                var client = new pg.Client(req.app.get('connexion'));
                client.connect();
                apk = '\\x' + apk;
                manifestAndroid = '\\x' + manifestAndroid;
                client.query('insert into file_table (idUser,dataapk,filenameapk,filenameapktest,datamanifest,dataapktest,filenamemanifest, datamanifestandroid, filenamemanifestandroid) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                    [req.session.idd, apk, req.files[0].originalname, "", "", "", "", manifestAndroid, req.files[1].originalname],
                    function (err, writeResult) {
                        console.log('err', err, 'pg writeResult', writeResult);
                        fs.unlink("./uploads/" + req.files[0].filename);
                        fs.unlink("./uploads/" + req.files[1].filename);
                        res.redirect("/filemanaging");
                    });
            });
        });
    }
});
module.exports = router;
