Editor.Interface = function() {
  var $editor = $('#editor');
  var editorHeight = 300;

  this.init = function() {
    bindEvents();
    hideScrollbars();
  };

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

  var bindEvents = function() {
    $(".selector-item").click(function(e) { this.togglePane(e.target.innerHTML); }.bind(this));
    $('#editor, #toolbar').hover(openEditor, closeEditor);
  }.bind(this);

  // stupid CodeMirror doesn't allow you to do this in stylesheets
  var hideScrollbars = function() { $('.CodeMirror-vscrollbar, .CodeMirror-hscrollbar').hide(); };

  this.init();
};
