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
  var query = data.query;
  if(!query.start){
    query.start = new Date('2015').toISOString();
  }
  if(!query.end){
    query.end = new Date().toISOString();
  }

  //log(JSON.stringify(tickets));
  var totalWork = 0;
  for(var i = 0; i<tickets.length; i++){
    var notes = tickets[i].notes;
    var work = 0;
    for(var j = 0; j<notes.length; j++){
      if(notes[j].dateCreated < query.end && notes[j].dateCreated > query.start){
        work += parseInt(notes[j].worklog);
      }
    }
    if(work > 0){
      $element.find('tbody').append('<tr class="clickable-row" data-href="/app/ticket/'+tickets[i].ticket_id+'"><td>'+tickets[i].ticket_id+' </td><td>'+tickets[i].title+' </td><td>'+tickets[i].status+' </td><td align="right">'+work+' </td></tr>');
      totalWork += work;
    }
    if(work == 0 && query.show){
      $element.find('tbody').append('<tr class="clickable-row" data-href="/app/ticket/'+tickets[i].ticket_id+'"><td>'+tickets[i].ticket_id+' </td><td>'+tickets[i].title+' </td><td>'+tickets[i].status+' </td><td align="right">'+work+' </td></tr>');
    }
  }
  $element.removeClass('hidden');
  
  //TODO: Clientes
  $element.find('.customer').text(tickets[0].customer.name+' '+tickets[0].customer.email);
  $element.find('.total').text("Total work log: "+ totalWork.toString());

  callback(data);

}