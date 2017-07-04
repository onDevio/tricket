const cheerio = require('cheerio');
const request = require('superagent');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/tricket';
//const mongoUrl = process.env.MONGO_URL || 'mongodb://tricket_mongo_1.docker:27017/tricket';
const moment = require('moment');

module.exports = {

    fromDate: new Date('2017-06-15'),

    loadIndexTickets: function () {
        var indexHtml = fs.readFileSync('./recover/Tickets.html');
        var $ = cheerio.load(indexHtml);
        var that = this;
        //return $('.cms-render-tickets').find('tr').map(function (index, element) {
        return $('#open,#closed').find('tr').map(function (index, element) {
            var $tds = $(element).find('td');
            var ticket_id = $tds.eq(0).text().trim();
            var title = $tds.eq(1).text().trim();
            var when = $tds.eq(2).text().trim();
            var status = $tds.eq(3).text().trim();
            var asignee = $tds.eq(4).text().trim();
            var email = $tds.eq(6).text().trim();
            var dateCreated = that.parseRelativeDateToISOString(that.fromDate, when);
            //console.log(status, when, dateCreated);
            
            /*
            console.log($(element).html());
            console.log('ticket_id: ', ticket_id);
            console.log('title: ', title);
            console.log('when: ', when);
            console.log('status: ', status);
            console.log('email: ', email);
            */
            var ticket = {
                ticket_id: ticket_id,
                customer: {
                    email: email,
                    name: ''
                },
                asignee: asignee,
                status: status,
                title: title,
                dateCreated: dateCreated,
                notes: [],
                files: []
            };
            return ticket;
        }).toArray();
    },

    recover: function () {
        var indexTickets = this.loadIndexTickets();

        for (ticket of indexTickets) {
            var ticket_id = ticket.ticket_id;
            this.addNotes(ticket);
            this.updateTicket(ticket);
        }

        console.log('Loaded tickets: ' + indexTickets.length);
    },

    parseDateToISOString: function (dateString) {
        var dateISOString = null;
        try {
            if (dateString != '') {
                var dateParts = dateString.split('/');
                var year = dateParts[2];
                var month = dateParts[1];
                var day = dateParts[0];
                dateISOString = year + '-' + month + '-' + day + 'T00:00:00.000Z';
            } else {
                dateISOString = new Date().toISOString();
            }
        } catch (err) {

        }
        return dateISOString;
    },

    parseRelativeDateToISOString: function (fromDate, relativeDate) {
        var relativeDateParts = relativeDate.split(' ');
        var howMuch = relativeDateParts[0];
        if (howMuch === 'a') {
            howMuch = 1;
        }
        var whatType = relativeDateParts[1];
        return moment.utc(fromDate).subtract(howMuch, whatType).toISOString();
    },

    addNotes: function (ticket) {
        var ticket_id = ticket.ticket_id;
        var ticketFilePath = './recover/trickets/' + ticket_id + '.htm';
        var existsTicket = fs.existsSync(ticketFilePath);
        var that = this;
        if (existsTicket) {
            var ticketFile = fs.readFileSync(ticketFilePath);
            var $ = cheerio.load(ticketFile);
            var notes = $('.note').map(function (index, element) {
                var $elem = $(element);
                var worklog = parseInt($elem.find('.note-worklog').first().text()) || 0;
                var body = $elem.find('.note-body.marked').first().text();
                var dateCreated = that.parseDateToISOString($elem.find('.note-real').first().text().replace('//', '/'));
                var user = $elem.find('.note-author').first().text();
                var type = $elem.find('.note-external').first().text() === 'External' ? 'External' : 'Internal';
                var note = {
                    'body': body,
                    'type': type,
                    'dateCreated': dateCreated,
                    'worklog': worklog,
                    'user': user
                };
                return note;
            }).toArray();

            ticket.notes = notes;
        }
    },

    updateTicket: function (ticket) {
        console.log(mongoUrl);
        MongoClient.connect(mongoUrl, function (err, db) {
            // Get the collection
            var col = db.collection('tickets');
            var ticket_id = ticket.ticket_id;
            //console.log(JSON.stringify(ticket, null, 2));
            col.findOneAndReplace({ ticket_id: ticket_id }
                , ticket
                , { upsert: true }
                , function (err, r) {
                    assert.equal(null, err);
                    db.close();
                });
        });
    }

}
