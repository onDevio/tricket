var express = require('express');
var router = express.Router();

router.get('/tickets', function(req, res) {
  res.render('dashboard/tickets.html');
});

router.get('/clients', function(req, res) {
  res.render('dashboard/clients.html');
});

router.get('/ticket/new', function(req, res) {
  res.render('dashboard/new_ticket.html');
});

router.get('/ticket/:id', function(req, res) {
  res.render('dashboard/view_ticket.html');
});

module.exports = router;
