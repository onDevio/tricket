'use strict';

var log = require('debug')('temply:cms-render-single-ticket');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }
  
  var ticket = data;
  log(JSON.stringify(ticket));

  $element.find('.id').text(ticket.ticket_id);

  var path = '/api/ticket/'+ticket.ticket_id;
  $element.find('form').attr('action',path);
  $element.find('.title').text(ticket.title);

  
  var status = ticket.status === "open" ? '<span class="label label-success">Open</span>' : '<span class="label label-danger">Closed</span>'
  $element.find('.status').append(status);

  $element.find('.worklog').text(ticket.worklog.toString());
  $element.find('.customer').text(ticket.customer);
  var date = new Date(ticket.dateCreated);
  $element.find('.date').text(date.toLocaleString());
  
  var notes = ticket.notes;
  notes.forEach(function(note){
  	log(note);
    date = new Date(ticket.dateCreated);
    $element.find('.notes').append('<div class="panel panel-default"><div class="panel-heading">Note type '+note.type+', '+note.user+' commented '+date.toLocaleString()+'</div><div class="panel-body"><div class="body-editable" data-type="textarea" data-pk="'+ticket.ticket_id+'" data-url="/post">'+note.body+'</a></div></div>');
  });
  
  callback(data);

}