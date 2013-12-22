Chat.Receiver = function() {
  var socket = Chat.Config.socket;

  this.init = function() {
    this.listen();
  };

  this.listen = function(callback) {
    socket.on('to_client.message', callback);
  };

  this.init();
};
