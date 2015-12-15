var express = require('express');
var router = express.Router();

router.get('/tickets', function(req, res) {
  res.render('dashboard/tickets.html');
});

router.get('/clients', function(req, res) {
  res.render('dashboard/clients.html');
});

router.get('/ticket/new', function(req, res) {
  res.render('dashboard/ticket.html');
});

module.exports = router;
