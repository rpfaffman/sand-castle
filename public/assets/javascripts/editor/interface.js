Editor.Interface = function() {
  var $editor = $('#editor');
  var paneHeight = 300;

  this.init = function() {
    bindEvents();
  };

  this.togglePane = function() {
    ($editor.height() === 0) ? openPane() : closePane();
  };

  this.switchPane = function(mode) {
    closePane();
    var selector = '#' + mode + 'EditField';
  };

  // private methods

  var openPane = function() {
    setHeight(paneHeight);
  };

  var closePane = function() {
    setHeight(0);
  };

  var setHeight = function(height) {
    $editor.css('height', height + 'px');
  };

  var bindEvents = function() {
    $editor.hover(openPane, closePane);
  };

  this.init();
};
