Editor.Interface.Submitter = function(opts) {
  var socket = Editor.Config.socket;
  var mirrors = { html: opts.htmlMirror, css: opts.cssMirror, javascript: opts.javascriptMirror };

  this.init = function() {
    //assignHandlers();
  };

  // private methods

  var assignHandlers = function() {
    _.each(_.keys(mirrors), function(key) {
      mirrors[key].on('keyup', function(e) {
        onShiftEnter(e, key);
      });
    }.bind(this));
  };

  var onShiftEnter = function(e, type) {
    if(e.keyCode === 13 && e.shiftKey) { submitCode(type); }
  };

  var submitCode = function(type) {
    socket.emit('code submit', { type: type, code: mirrors[type].getValue() });
  };

  this.init();
};
