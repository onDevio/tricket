var express = require('express');
var router = express.Router();

router.get('/tickets', function(req, res) {
  res.render('dashboard/tickets.html', {user: req.user});
});

router.get('/reports', function(req, res) {
  res.render('dashboard/reports.html', {user: req.user, customer: req.query.customer, start: req.query.start, end: req.query.end });
});

router.get('/customers', function(req, res) {
  res.render('dashboard/customers.html', {user: req.user});
});

router.get('/ticket/new', function(req, res) {
  res.render('dashboard/new_ticket.html', {user: req.user});
});

router.get('/ticket/:id', function(req, res) {
  res.render('dashboard/view_ticket.html', {id : req.params.id, user: req.user});
});

module.exports = router;
