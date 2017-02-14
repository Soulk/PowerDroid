var express = require('express');
var router = express.Router();
var pg = require("pg");
var fs = require('file-system');
var path = require('path');
var mime = require('mime');

/* Fichier correspondant à la route de la page de listing des différents tests possibles lançable par l'utilisateur connecté */


/* Affichage de la page de lancement de script - filemanaging-view.ejs */
router.get('/', function (req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();

    var query = client.query("SELECT * FROM file_table WHERE idUser='" + req.session.idd + "'");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        client.end();
        res.render('filemanaging-view', {rows: result.rows});
    });
});

/* Fonction permettant le téléchargement du fichier associé dans le répertoire utilisateur */
router.get('/dll', function (req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    client.query("SELECT * FROM file_table WHERE id='" + req.query.id + "'",
        function (err, readResult) {
            console.log('err', err, 'pg readResult', readResult);
            var fileName = req.query.scope == "apk" ? readResult.rows[0].filenameapk : req.query.scope == "apkTest" ? readResult.rows[0].filenameapktest : readResult.rows[0].filenamemanifest;
            var dataFile = req.query.scope == "apk" ? readResult.rows[0].dataapk : req.query.scope == "apkTest" ? readResult.rows[0].dataapktest : readResult.rows[0].datamanifest;

            fs.writeFile('./uploads/' + fileName, dataFile);

            var file = './uploads/' + fileName;

            var filename = path.basename(file);
            var mimetype = mime.lookup(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
            fs.unlink("./uploads/" + fileName);
        });
});

/* Suppression de la ligne de script dans la base de donnée */
router.get('/del', function (req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    client.query("DELETE FROM file_table WHERE id='" + req.query.id + "'",
        function (err, readResult) {
            console.log('err', err, 'pg readResult', readResult);
            res.redirect("/filemanaging-view");
        });
});

/* Route permettant le lancement de la routine d'execution de script par écriture dans la base
 d'une ligne dans la table Script et une ligne dans la table Result */
router.get('/script', function (req, res, next) {
    var client = new pg.Client(req.app.get('connexion'));
    client.connect();
    console.log(req.query.id);
    client.query("insert into script (idFile, method) values ($1, $2)", [req.query.id, req.query.method], function (err, readResult) {
        console.log('err', err, 'pg readResult', readResult);
        client.query("insert into result (data, idfile, method, status) values ($1, $2, $3, $4)", [null, req.query.id, req.query.method, false], function (err, readResult) {
            console.log('err', err, 'pg readResult', readResult);
            res.redirect("/index");
        });
    });
});

module.exports = router;
