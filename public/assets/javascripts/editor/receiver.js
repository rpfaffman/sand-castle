Editor.Receiver = function(socket) {
  var socket = Editor.Config.socket;
  var $sandbox = {
    html: $(Editor.Config.htmlSelector),
    javascript: $(Editor.Config.javascriptSelector),
    css: $(Editor.Config.cssSelector)
  };

  this.init = function() {
    this.listen();
  };

  this.listen = function() {
    socket.on('to_client.edit', function(data) {
      $(data.targetSelector)[0].outerHTML = data.html;
    });

    socket.on('code submit', function(data) {
      console.log('submitted code received');
      $sandbox[data.type].html(data.code);
    });
  };

  this.init();
};

