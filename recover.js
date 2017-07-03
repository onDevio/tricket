const cheerio = require('cheerio');
const request = require('superagent');
const fs = require('fs');
const tricketUrl = 'http://localhost:32770';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoUrl = 'mongodb://mongo:27017/tricket';

function loadIndexTickets() {
    var indexHtml = fs.readFileSync('./recover/Tickets.html');
    var $ = cheerio.load(indexHtml);
    return $('.cms-render-tickets').find('tr').map(function (index, element) {
        var $tds = $(element).find('td');
        var ticket_id = $tds.eq(0).text().trim();
        var title = $tds.eq(1).text().trim();
        var when = $tds.eq(2).text().trim();
        var status = $tds.eq(3).text().trim();
        var asignee = $tds.eq(4).text().trim();
        var email = $tds.eq(6).text().trim();
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
            dateCreated: new Date().toISOString(),
            notes: [],
            files: []
        };
        return ticket;
    }).toArray();
}

function existsTicketId() {
    request.get(tricketUrl + '')
}

/*
$('#open').find('tr').each(function(index, element) {
    console.log($(element).find('td').html());
});
*/

function recover() {
    var indexTickets = loadIndexTickets();

    for (ticket of indexTickets) {
        var ticket_id = ticket.ticket_id;
        addNotes(ticket);
        updateTicket(ticket);
    }

    console.log('Loaded tickets: ' + indexTickets.length);
}

function addNotes(ticket) {
    var ticket_id = ticket.ticket_id;
    var ticketFilePath = './recover/trickets/' + ticket_id + '.htm';
    //console.log('ticketFilePath', ticketFilePath);
    var existsTicket = fs.existsSync(ticketFilePath);
    if (existsTicket) {
        var ticketFile = fs.readFileSync(ticketFilePath);
        var $ = cheerio.load(ticketFile);
        var notes = $('.note').map(function (index, element) {
            var $elem = $(element);
            var worklog = parseInt($elem.find('.note-worklog').first().text()) || 0;
            var body = $elem.find('.note-body.marked').first().text();
            var dateCreated = $elem.find('.note-real').first().text().replace('//', '/');
            try {
                if (dateCreated != '') {
                    dateCreated = new Date(dateCreated).toISOString();
                } else {
                    dateCreated = new Date().toISOString();
                }
            } catch (err) {
                dateCreated = null;
            }
            //console.log(ticket_id, dateCreated);
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
}

function updateTicket(ticket) {
    MongoClient.connect(mongoUrl, function (err, db) {
        // Get the collection
        var col = db.collection('tickets');
        var ticket_id = ticket.ticket_id;
        col.findOneAndReplace({ ticket_id: ticket_id }
            , ticket
            , { upsert: true }
            , function (err, r) {
                assert.equal(null, err);
                db.close();
            });
    });
}

console.log('Starting ticket recovery');
recover();
