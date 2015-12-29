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
  $element.find('.asignee').text(ticket.asignee);

  ticket.asignee !== ticket.user.displayName ?  $element.find('#asign').attr('href', '/api/ticket/'+ticket.ticket_id+'/asign/'+ticket.user.displayName).attr('style', 'display:inline;') : $element.find('#reject').attr('href', '/api/ticket/'+ticket.ticket_id+'/reject/').attr('style', 'display:inline;');
  

  var status = '';
  var buttons = '';
  switch(ticket.status) {
    case 'Closed':
        status = '<span class="label label-danger">Closed</span>';
        buttons = 'closed';
        break;
    case 'Trashed':
        status = '<span class="label label-danger">Trashed</span>';
        buttons = 'trashed';
        break;
    default:
        status = '<span class="label label-success">Open</span>';
        buttons = 'open';
  }

  $element.find('.status').html(status);
  
  $element.find('.buttons .'+buttons).attr('style', 'display:inline;');
    
  $element.find('.customer').text(ticket.customer.name +' '+ ticket.customer.email);
  
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