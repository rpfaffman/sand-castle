$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);

  // Initialize the Editor
  Editor.Config.socket = socket;
  new Editor.Receiver();
  new Editor.Modal(new Editor.Sender());

  //Initialize the Chat

  // CHAT
  Chat.Config.socket = socket;
  new Chat.Receiver();
  new Chat.Sender();

});

