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
            var dataFileApk = readResult.rows[0].dataapk;
            fs.writeFile('./uploads/'+fileNameApk, dataFileApk);

            var path = "./script/platform-tools/script.bat";

            if(req.query.method == 'robotium'){
                var fileNameManifest = readResult.rows[0].filenamemanifest;
                var fileNameApkTest = readResult.rows[0].filenameapktest;
                var dataFileApkTest = readResult.rows[0].dataapktest;
                var dataManifest = readResult.rows[0].datamanifest;
                fs.writeFile('./uploads/'+fileNameApkTest, dataFileApkTest);
                fs.writeFile('./uploads/' + fileNameManifest, dataManifest);

                fs.readFile('./uploads/'+fileNameManifest, function read(err, content) {
                    if (err) {
                        throw err;
                    }

                    var regex = /package="(.*)"/g;
                    var regex1 = /<instrumentation android:name="(.*)"/g;

                    var result1 = regex.exec(content)[1];
                    var result2 = regex1.exec(content)[1];

                    var data = "adb shell input keyevent 26\nadb install -r " + fileNameApk + "\nadb install -r " + fileNameApkTest + "\nadb shell am instrument -w " + result1 + "/" + result2 + "\n";

                    var files = [fileNameApk, fileNameApkTest, fileNameManifest];
                    launchScript(path, files, data);
                });

            } else if (req.query.method == 'monkey') {
                var fileNameManifestAndroid = readResult.rows[0].filenamemanifestandroid;
                var dataManifestAndroid = readResult.rows[0].datamanifestandroid;
                fs.writeFile('./uploads/' + fileNameManifestAndroid, dataManifestAndroid);

                fs.readFile('./uploads/'+fileNameManifestAndroid, function read(err, content) {
                    if (err) {
                        throw err;
                    }

                    var regex3= /package="(.*)" /g;
                    var result3 = regex3.exec(content)[1];
                    var data = "adb shell input keyevent 26\nadb install -r " + fileNameApk + "\nadb shell monkey -p " +result3+ " -v -s 0005 1000";
                    var files = [fileNameApk, fileNameManifestAndroid];
                    launchScript(path, files, data);
                });

            } else {
                throw err;
            }

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

function launchScript(path, files, data){
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
                    for(var file in files){
                        fs.unlink("./uploads/"+files[file]);
                    }
                });
        }
    });
}
module.exports = router;
