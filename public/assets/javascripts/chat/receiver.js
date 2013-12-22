Chat.Receiver = function() {
  var socket = Chat.Config.socket;

  this.init = function() {
    this.listen();
  };

  this.listen = function(callback) {
    socket.on('message', callback);
  };

  this.init();
};
