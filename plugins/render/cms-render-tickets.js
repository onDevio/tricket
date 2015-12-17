'use strict';

var log = require('debug')('temply:cms-render-tickets');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }
  
  var tickets = data.contents;
  //log(JSON.stringify(tickets));
  

  tickets.forEach(function(ticket){
  	//log(ticket);
  	var date = new Date(ticket.dateCreated);
    var notes = ticket.notes;
    var work = 0;
    notes.forEach(function(note){
      //log(note);
      work += parseInt(note.worklog);
    });  	
  	$element.append('<tr class="clickable-row" data-href="/app/ticket/'+ticket.ticket_id+'"><td>'+moment(date).fromNow()+'</td><td>'+ticket.status+'</td><td>'+work+'</td><td>'+ticket.customer+'</td><td>'+ticket.ticket_id+'</td><td>'+ticket.title+'</td></tr>');
  });
  
  callback(data);

}