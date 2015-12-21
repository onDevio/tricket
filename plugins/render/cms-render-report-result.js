'use strict';

var log = require('debug')('temply:cms-render-report-result');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }
  
  var tickets = data.contents;

  if (!tickets || tickets.length < 1) {
    callback();
    return;
  }

  //log(JSON.stringify(tickets));
  var totalWork = 0;
  tickets.forEach(function(ticket){
  	//log(ticket);
    var notes = ticket.notes;
    var work = 0;
    notes.forEach(function(note){
      //log(note);
      work += parseInt(note.worklog);
    });  	
    
  	$element.find('tbody').append('<tr class="clickable-row" data-href="/app/ticket/'+ticket.ticket_id+'"><td>'+ticket.ticket_id+' </td><td>'+ticket.title+' </td><td>'+ticket.status+' </td><td align="right">'+work+' </td></tr>');
    $element.removeClass('hidden');
    totalWork += work;
    //log(totalWork);
  });
  
  //TODO: Clientes
  $element.find('.customer').text(tickets[0].customer.name+' '+tickets[0].customer.email);
  $element.find('.total').text("Total work log: "+ totalWork.toString());

  callback(data);

}