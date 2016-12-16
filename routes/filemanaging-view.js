var express = require('express');
var router = express.Router();
var pg = require("pg");
var fs = require('file-system');
var path = require('path');
var mime = require('mime');
var exec = require('child_process').exec, child;

/* GET filemanaging view page. */
router.get('/', function(req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();

    var query = client.query("SELECT * FROM file_table WHERE idUser='"+req.session.idd+"'");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        client.end();
        res.render('filemanaging-view', { rows: result.rows});
    });
});

router.get('/dll',function(req,res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    client.query("SELECT * FROM file_table WHERE id='"+req.query.id+"'",
        function(err, readResult) {
            console.log('err',err,'pg readResult',readResult);
            var fileName = req.query.scope == "apk" ? readResult.rows[0].filenameapk : req.query.scope == "apkTest" ? readResult.rows[0].filenameapktest : readResult.rows[0].filenamemanifest;
            var dataFile = req.query.scope == "apk" ? readResult.rows[0].dataapk : req.query.scope == "apkTest" ? readResult.rows[0].dataapktest : readResult.rows[0].datamanifest;

            fs.writeFile('./uploads/'+fileName, dataFile);

            var file = './uploads/'+fileName;

            var filename = path.basename(file);
            var mimetype = mime.lookup(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
            fs.unlink("./uploads/"+fileName);
        });
});

router.get('/del',function(req,res,next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    client.query("DELETE FROM file_table WHERE id='"+req.query.id+"'",
        function(err, readResult) {
            console.log('err',err,'pg readResult',readResult);
            res.redirect("/filemanaging-view");
        });
});

router.get('/script',function(req,res,next) {

    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    client.query("SELECT * FROM file_table WHERE id='"+req.query.id+"'",
        function(err, readResult) {
            console.log('err',err,'pg readResult',readResult);
            var fileNameApk = readResult.rows[0].filenameapk;
            var fileNameApkTest = readResult.rows[0].filenameapktest
            var fileNameManifest = readResult.rows[0].filenamemanifest;

            var dataFileApk = readResult.rows[0].dataapk;
            var dataFileApkTest = readResult.rows[0].dataapktest;
            var dataFileManifest = readResult.rows[0].datamanifest;


            fs.writeFile('./uploads/'+fileNameApk, dataFileApk);
            fs.writeFile('./uploads/'+fileNameApkTest, dataFileApkTest);
            fs.writeFile('./uploads/'+fileNameManifest, dataFileManifest);

            console.log(req);
            var path = "./script/platform-tools/script.bat";

            fs.readFile('./uploads/'+fileNameManifest, function read(err, content) {
                if (err) {
                    throw err;
                }

                var regex = /package="(.*)"/g;
                var regex1 =/<instrumentation android:name="(.*)"/g;

                var result1 = regex.exec(content)[1];
                var result2 = regex1.exec(content)[1];

                var data = "adb shell input keyevent 26\nadb install -r "+fileNameApk+"\nadb install -r "+fileNameApkTest+"\nadb shell am instrument -w "+result1+"/"+result2+"\nexit\n";
                console.log(data);
                fs.writeFile(path, data, function(error) {
                    if (error) {
                        console.error("write error:  " + error.message);
                    } else {
                        console.log("Successful Write to " + path);
                        child = exec('start script.bat',{cwd: 'script\\platform-tools'},
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                                fs.unlink("./uploads/"+fileNameApk);
                                fs.unlink("./uploads/"+fileNameApkTest);
                                fs.unlink("./uploads/"+fileNameManifest);
                            });
                    }
                });

            });

            //TODO : Modifier l'adresse pour la release
            /*
             child = exec('',{cwd: 'C:\\Users\\David\\AppData\\Local\\Android\\android-sdk\\platform-tools'},
             function (error, stdout, stderr) {
             console.log('stdout: ' + stdout);
             console.log('stderr: ' + stderr);
             if (error !== null) {
             console.log('exec error: ' + error);
             }
             });
             */



        });

});

module.exports = router;
