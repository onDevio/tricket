var express = require('express');
var router = express.Router();

var multer  = require('multer');
var upload = multer();

router.get('/login', function(req, res, next) {
  res.render('dashboard/login.html');
});

router.get('/home', function(req, res, next) {
  res.render('dashboard/tickets.html');
});

router.get('/tickets', function(req, res, next) {
  res.render('dashboard/tickets.html');
});

router.get('/clients', function(req, res, next) {
  res.render('dashboard/clients.html');
});

router.post('/emails', upload.array(), function(req, res, next) {
  var msg = JSON.parse(req.body.mailinMsg);
  console.log('POST /emails msg:' + JSON.stringify(msg, null, 2));

  //console.log('POST /emails req.text:' + req.text);
  res.status(200).end();
});

router.head('/emails', function(req, res, next) {
  res.status(200).end();
});

router.get('/emails', function(req, res, next) {
  res.status(200).end();
});

module.exports = router;
