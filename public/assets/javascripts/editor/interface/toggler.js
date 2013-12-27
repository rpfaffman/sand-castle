Editor.Interface.Toggler = function() {
  var $editorContainer = $(Editor.Config.editorContainerSelector);
  var $editor = $editorContainer.find('#editor');
  var editorHeight = 300;

  this.toggleEditor = function() { ($editor.height() === 0) ? openEditor() : closeEditor(); };

  this.togglePane = function(pane) {
    var $pane = $editor.find('#' + pane + 'EditField');
    ($pane.width() === 0) ? openPane($pane) : closePane($pane);
    toggleSwitch(pane);
  };

  // private methods

  var openEditor = function() { setHeight(editorHeight); };

  var closeEditor = function() { setHeight(0); };

  var openPane = function($pane) {
    removePaneSizing();
    $pane.removeClass('closed').addClass('open');
    resizePanes();
  };

  var closePane = function($pane) {
    console.log('closePane called');
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
