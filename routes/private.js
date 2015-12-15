var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

router.get('/tickets', function(req, res, next) {
  res.render('dashboard/tickets.html');
});

router.get('/clients', function(req, res, next) {
  res.render('dashboard/clients.html');
});

module.exports = router;
