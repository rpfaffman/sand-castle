Editor.Interface.Toggler = function() {
  var $editorContainer = $(Editor.Config.editorContainerSelector);
  var $editor = $editorContainer.find('#editor');
  var editorHeight = 300;

  this.togglePane = function(pane) {
    var $pane = $editor.find('#' + pane + 'EditField');
    ($pane.width() === 0) ? openPane($pane) : closePane($pane);
    toggleSwitch(pane);
  };

  this.openEditor = function() { setHeight(editorHeight); };

  this.closeEditor = function() { setHeight(0); };

  // private methods

  var openPane = function($pane) {
    removePaneSizing();
    $pane.removeClass('closed').addClass('open');
    resizePanes();
  };

  var closePane = function($pane) {
    removePaneSizing();
    $pane.removeClass('open').addClass('closed');
    resizePanes();
  };

  var toggleSwitch = function(pane) {
    var paneOpen = $('#' + pane + 'EditField').hasClass('open');
    paneOpen ? $('#' + pane + '-switch').addClass('open') : $('#' + pane + '-switch').removeClass('open');
  };

  var removePaneSizing = function() {
    var $openPanes = $editor.find('.open');
    $openPanes.removeClass('size1of' + $openPanes.length);
  };

  var resizePanes = function() {
    var $openPanes = $editor.find('.open');
    $openPanes.addClass('size1of' + $openPanes.length);
  };

  var setHeight = function(height) { $editor.css('height', height + 'px'); };
};
