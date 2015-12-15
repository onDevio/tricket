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
    // TODO Visit all plugins
    request(app)
      .post('/api/emails')
      .send(msg)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).not.to.be.null;
        expect(res.status).to.equal(201);
        var ticket = res.body;
        expect(ticket.title).to.equal('New Ticket');
        expect(ticket.body).to.equal('Hello world!');
        expect(ticket.customer).to.equal('john.doe@somewhere.com');
        expect(ticket.status).to.equal('Open');
        expect(ticket.worklog).to.equal(0);
        done();
      });
  });

});