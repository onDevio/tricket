var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/tickets', function(req, res) {
  res.render('dashboard/tickets.html');
});

router.get('/clients', function(req, res) {
  res.render('dashboard/clients.html');
});

router.get('/ticket/new', function(req, res) {
  res.render('dashboard/ticket.html');
});

router.post('/ticket/new', function(req, res) {
  console.log(req.body);
  res.render('dashboard/tickets.html');
});

module.exports = router;
