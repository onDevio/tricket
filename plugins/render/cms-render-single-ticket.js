'use strict';

var log = require('debug')('temply:cms-render-single-ticket');
var moment = require('moment');

module.exports = function(data, $element, callback) {
  if (!data) {
    callback();
    return;
  }
  
  var ticket = data;
  log(JSON.stringify(ticket));

  $element.find('.id').text(ticket.ticket_id);

  var path = '/api/ticket/'+ticket.ticket_id+'/note';
  $element.find('form').attr('action',path);
  $element.find('.title').text(ticket.title);

  
  var status = ticket.status === "Open" ? '<span class="label label-success">Open</span>' : '<span class="label label-danger">Closed</span>'
  $element.find('.status').append(status);
  var buttons = ticket.status !== "Open" ? 'open' : 'closed'
  $element.find('.buttons .'+buttons).remove();
    
  $element.find('.customer').text(ticket.customer);
  
  var notes = ticket.notes;
  var work = 0;
  notes.forEach(function(note){
  	//log(note);
    var date = new Date(note.dateCreated);
    work += parseInt(note.worklog);
    var type = note.type !== "internal" ? '<span class="label label-warning">External</span>' : '<span class="label label-default">Internal</span>'
    //log(note.type);
    $element.find('.notes').append('<div class="panel panel-default"><div class="panel-heading">'+type+' '+note.user+' commented '+moment(date).fromNow()+' <span class="pull-right label label-info">Spent: '+note.worklog+' Hours</span></div><div class="panel-body">'+note.body+'</div></div>');
  });

  $element.find('.worklog').text(work.toString());
  
  callback(data);

}