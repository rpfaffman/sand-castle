$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);

  // Initialize the Editor
  Editor.Config.socket = socket;
  var editorReceiver = new Editor.Receiver();
  var editorSender = new Editor.Sender();
  var editorModal = new Editor.Modal(editorSender);
  editorReceiver.listen();

  //Initialize the Chat

  // CHAT
  var $chat = $('#chat');
  var $chatAliasField = $('#chat-alias-field');
  var $chatSendField = $('#chat-send-field');
  var $chatSendButton = $('#chat-send-button');

  Chat.Config.socket = socket;
  var chatReceiver = new Chat.Receiver();

  // Receiving
  socket.on('to_client.message', function(data) {
    console.log('Received chat message from ' + data.sender + ': ' + data.message);
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
});

