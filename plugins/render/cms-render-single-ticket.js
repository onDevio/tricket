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

  
  var status = ticket.status === "Open" ? '<span class="label label-success">Open</span>' : '<span class="label label-danger">Closed</span>'
  $element.find('.status').append(status);

  
  $element.find('.customer').text(ticket.customer);
  var date = new Date(ticket.dateCreated);
  $element.find('.date').text(date.toLocaleString());
  
  var notes = ticket.notes;
  var work = 0;
  notes.forEach(function(note){
  	log(note);
    date = new Date(ticket.dateCreated);
    work += note.worklog;
    $element.find('.notes').append('<div class="panel panel-default"><div class="panel-heading">Note type '+note.type+', '+note.user+' commented '+date.toLocaleString()+' <span class="pull-right label label-info">Spent: '+note.worklog+' Hours</span></div><div class="panel-body">'+note.body+'</div></div>');
  });

  $element.find('.worklog').text(work.toString());
  
  callback(data);

}