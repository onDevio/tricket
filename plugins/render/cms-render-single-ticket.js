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
  $element.find('.customer-email').attr('data-url', '/api/ticket/' + ticket.ticket_id + '/save');
  $element.find('.customer-email').attr('data-pk', ticket.ticket_id);

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

  $element.find('.customer-name').text(ticket.customer.name);
  $element.find('.customer-email').text(ticket.customer.email);

  var notes = ticket.notes;
  var work = 0;
  var noteTemplate = $element.find('.notes .note').remove();
  notes.forEach(function(note, index){
  	//log(note);
    var noteItem = noteTemplate.clone();
    var date = new Date(note.dateCreated);
    work += parseInt(note.worklog);

    if (note.type !== "internal") {
      noteItem.find('.note-internal').remove();
      noteItem.find('.hidden').attr('id','external');
    }
    if (note.type !== "external") {
      noteItem.find('.note-external').remove();
      noteItem.find('.hidden').attr('id','internal');
    }
    noteItem.find('.note-author').text(note.user);
    noteItem.find('.note-date').text(moment(date).fromNow());
    noteItem.find('.note-worklog').text(note.worklog.toString());

    noteItem.find('.edit').attr('onclick', "edit("+index+")");
    noteItem.find('.note-editable').attr('id', 'note-'+index);

    noteItem.find('.note-body').attr('data-url', '/api/ticket/' + ticket.ticket_id + '/'+index+'/save');    
    noteItem.find('.note-body').attr('data-pk', ticket.ticket_id);
    //log(note.type);
    noteItem.find('.note-body').text(note.body);
    $element.find('.notes').append(noteItem);
  });

  $element.find('.worklog').text(work.toString());

  callback(data);

}
