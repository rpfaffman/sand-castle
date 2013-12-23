Editor.FullModal = function(type) {
  var socket = Editor.Config.socket;
  var $modal = $(Editor.Config.fullModalSelector);
  var $textField = $modal.find('.edit-text');
  var $closeButton = $modal.find('.close-button');

  this.init = function() {
    $closeButton.click(this.close);
    $textField.keyup(syncOrSubmit);
    $textField.keypress(preventChat);
    listenForSync();
  };

  this.open = function() {
    updateText(function(data) { $textField.val(data); });
    $modal.fadeIn();
  };

  this.close = function() {
    stopListeningForSync();
    $modal.fadeOut();
  };

  // private methods

  var preventChat = function(e) {
    e.stopPropagation();
  };

  var updateText = function(callback) {
    $.get(type, callback);
  };

  var syncOrSubmit = function(e) {
    e.stopPropagation();
    ((e.keyCode === 13) && (e.shiftKey)) ? submitChanges(e) : sync();
  };

  var submitChanges = function(e) {
    socket.emit('edit submit', { type: type, text: $textField.val() });
  };

  var sync = function() {
    socket.emit('edit sync', { type: type, text: $textField.val() });
  };

  var listenForSync = function() {
    socket.on(type + ' edit', function(data) {
      $textField.val(data.text);
    });
  };

  var stopListeningForSync = function() {
    socket.removeListener(type + ' edit');
  };

  this.init();
};
