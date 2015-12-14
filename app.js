var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var templyEngineFactory = require('temply-express');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var app = express();

// TODO Move this out of this file
// http://expressjs.com/advanced/developing-template-engines.html
var pluginsRepository = [path.join(__dirname, 'plugins/data'), path.join(__dirname, 'plugins/render')];

var templyEngine = templyEngineFactory(pluginsRepository);
app.engine('html', templyEngine);

// view engine setup
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//FIXME no funcionando
//app.use(require('connect-livereload')());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/template', express.static(path.join(__dirname, 'template')));
app.use('/vendor', express.static(path.join(__dirname, 'bower_components')));

app.use('/app', ensureAuthenticated, require('./routes/private'));
app.use('/', require('./routes/public'));

passport.use(new LocalStrategy(
  function(username, password, done) {
    //Personalizar para mongo

    if (username !== ''){
      var user = {id: 1, username: 'admin', password: 'admin'};
      return done(null, user);
    }
    /*
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  */
  }
));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete LinkedIn profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

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
    /*
    res.render('error', {
      message: err.message,
      error: err
    });
    */
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  /*
  res.render('error', {
    message: err.message,
    error: {}
  });
  */
  res.send(err.message);
});

module.exports = app;
