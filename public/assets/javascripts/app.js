$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);

  // edit modal
  $('#sandbox').on('click', function(event) {
    console.log('You just clicked on ' + event.target);
    console.log(event);
    console.log(event.target);
    console.log(event.target.outerHTML);
    console.log(event.target.id);
    debugger;
    showEditModal(event);
  });

  function showEditModal(event) {
    var target = event.target;
    var $editModal = $('#edit-modal');
    $('#edit-send-field').val(event.target.innerHTML);
    $editModal.css({ top: event.pageY, left: event.pageX });
    $editModal.fadeIn();
    $('#edit-send-button').bind('click', function() {
      sendEdit(target);
    }.bind(this));
  };

  // receiving
  socket.on('to_client.edit', function(data) {
    console.log('received edit!' + data);
  });

  // sending
  function sendEdit(targetSelector) {
    console.log('send edit');
    console.log(targetSelector);
    socket.emit('to_server.edit', {
      sender: $chatAliasField.val(),
      edit: $('#edit-send-field').val(),
      targetSelector: targetSelector
    });
  };

  // CHAT
  var $chat = $('#chat');
  var $chatAliasField = $('#chat-alias-field');
  var $chatSendField = $('#chat-send-field');
  var $chatSendButton = $('#chat-send-button');

  // Receiving
  socket.on('to_client.message', function(data) {
    console.log('Received chat message from ' + data.sender + ': ' + data.message + '.');
  });

  // Sending
  $chatSendButton.on('click', sendChatMessage);
  function sendChatMessage() {
    socket.emit('to_server.message',
                {
                  sender: $chatAliasField.val(),
                  message: $chatSendField.val()
                });
  };
})
