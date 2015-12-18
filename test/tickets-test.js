var request = require('supertest'),
  expect = require('chai').expect,
  app = require('../app');

describe('Tickets REST', function() {

  var readFileOptions = {
    encoding: 'utf8',
    flag: 'r'
  };

  var msg = require('./mailinMsg');

  it('should create a ticket from an email', function(done) {
    request(app)
      .post('/api/emails')
      .send(msg)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).not.to.be.null;
        expect(res.status).to.equal(201);
        var ticket = res.body;
        expect(ticket.title).to.equal('New Ticket');
        expect(ticket.notes).to.have.length(1);
        expect(ticket.notes[0].body).to.equal('Hello world!');
        expect(ticket.customer).to.equal('john.doe@somewhere.com');
        expect(ticket.status).to.equal('Open');
        expect(ticket.worklog).to.equal(0);
        done();
      });
  });

  it('should create a ticket with new id', function(done) {
    var ticket = {
      customer: 'person@customer.com',
      title: 'Ticket Title',
      notes: [{
        'body': 'Ticket body',
        //'type': 'external',
        'worklog': 5,
        //'user' : req.user.displayName
      }]
    };
  });

});
