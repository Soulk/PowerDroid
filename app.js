var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var jquerycsv = require('jquery-csv');

var routes = require('./routes/login');
var users = require('./routes/users');
var index = require('./routes/index');
var login = require('./routes/login');
var filemanaging = require('./routes/filemanaging');
var filemanagingview = require('./routes/filemanaging-view');
var resultat = require('./routes/resultat');


var PropertiesReader = require('properties-reader');
const requests = PropertiesReader('models/requests.properties');

var app = express();

app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('uploads'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: "This is a secret"
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/index', index);
app.use('/login', login);
app.use('/filemanaging', filemanaging);
app.use('/filemanaging-view', filemanagingview);
app.use('/resultat', resultat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var conString = "";
app.set("connexion",conString);

var pg = require('pg');
pg.connect(conString, function (err, client, done) {
    if (err) {

        if(err.indexOf('already exists') <= -1){
          return err
        }
    }
    var tmpR = requests.getAllProperties();

    for(var r in tmpR) {
      if (r !== undefined)
          if (tmpR.hasOwnProperty(r)) {
              //console.log("Key is " + r + ", value is" + tmpR[r]);
              if (r.indexOf('table.create') > -1) {
                  var query = client.query(tmpR[r]);
                  query.on('error', function(err) {
                      console.log('Query error: ' + err);
                  });
              }
          }
    }
})

module.exports = app;
