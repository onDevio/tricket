const cheerio = require('cheerio');
var fs = require('fs');
var indexHtml = fs.readFileSync('recover/Tickets.html');
const $ = cheerio.load(indexHtml)
var indexTickets = [];
function loadIndexTickets() {
    indexTickets = $('#open').find('tr').map(function (index, element) {
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

/*
$('#open').find('tr').each(function(index, element) {
    console.log($(element).find('td').html());
});
*/
loadIndexTickets();
console.log(JSON.stringify(indexTickets, null ,2));