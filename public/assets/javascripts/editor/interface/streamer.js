Editor.Interface.Streamer = function(opts) {
  var socket = Editor.Config.socket;
  var mirrors = { html: opts.htmlMirror, css: opts.cssMirror, javascript: opts.javascriptMirror };

  this.init = function() {
    assignHandlers();
    listen();
  };

  // private methods

  var assignHandlers = function() {
    _.each(_.keys(mirrors), function(key) {
      mirrors[key].on('keyup', function() { sendChange(key); });
    });
  };

  var sendChange = function(type) {
    socket.emit('code edit', { type: type, changes: mirrors[type].getValue() });
  };

  var syncChanges = function(data) {
    var cursorPosition = mirrors[data.type].getCursor();
    mirrors[data.type].setValue(data.changes);
    mirrors[data.type].setCursor(cursorPosition);
  };

  var listen = function() { socket.on('code edit', syncChanges); };

  this.init();
};
