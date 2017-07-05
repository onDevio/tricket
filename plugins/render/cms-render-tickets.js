'use strict';

var log = require('debug')('temply:cms-render-tickets');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }
  var currentUser = data.user;
  var tickets = data.contents;
  //log(JSON.stringify(tickets));


  tickets.forEach(function(ticket){
  	//log(ticket);
  	var date = new Date(ticket.dateCreated);
    var notes = ticket.notes;
    var asignee = ticket.asignee || 'Not asigned';
    var worklog = ticket.worklog;
    if (!worklog) {
      var worklog = 0;
      notes.forEach(function(note){
        //log(note);
        worklog += parseInt(note.worklog);
      });
    }
    var trash = ticket.status === 'Trashed' ? '<a href="/api/ticket/'+ticket.ticket_id+'/untrash" class="btn btn-default"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Untrash</a></td>' : '<a href="/api/ticket/'+ticket.ticket_id+'/trash" class="btn btn-default"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Trash</a></td>';

    if(ticket.asignee === currentUser.displayName){
      $element.find('#mine tbody').append('<tr class="clickable-row" data-href="/app/ticket/'+ticket.ticket_id+'"><td>'+ticket.ticket_id+' </td><td>'+ticket.title+' </td><td>'+moment(date).fromNow()+' </td><td>'+ticket.status+' </td><td>'+asignee+' </td><td>'+worklog+' </td><td>'+ticket.customer.email+' </td><td>'+trash+'</td></tr>');
    }

    var statusLowerCase = ticket.status.toLowerCase();
    //console.log('ticket.status.toLowerCase()', statusLowerCase);
    if (!statusLowerCase || statusLowerCase === '') {
      return;
    }
  	$element
      .find('#'+statusLowerCase+' tbody')
      .append('<tr class="clickable-row" data-href="/app/ticket/'+ticket.ticket_id+'"><td>'+ticket.ticket_id+' </td><td>'+ticket.title+' </td><td>'+moment(date).fromNow()+' </td><td>'+ticket.status+' </td><td>'+asignee+' </td><td>'+worklog+' </td><td>'+ticket.customer.email+' </td><td>'+trash+'</td></tr>');
  });

  callback(data);

}
