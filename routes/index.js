var express = require('express');
var router = express.Router();

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

router.post('/emails', function(req, res, next) {
  console.log('POST /emails request.body:' + JSON.stringify(req.body));
  res.status(200).end();
});

router.head('/emails', function(req, res, next) {
  res.status(200).end();
});

router.get('/emails', function(req, res, next) {
  res.status(200).end();
});

module.exports = router;
