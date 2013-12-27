Editor.Interface = function(mirrors) {
  var $editorContainer = $(Editor.Config.editorContainerSelector);
  var $editor = $editorContainer.find('#editor');
  var toggler = new Editor.Interface.Toggler();

  this.init = function() {
    bindEvents();
    hideScrollbars();
  };

  this.refreshMirrors = function() {
    _.each(mirrors, function(mirror) { mirror.refresh() });
  };

  // private methods

  var bindEvents = function() {
    $editorContainer.find(".selector-item").click(function(e) { toggler.togglePane(e.target.innerHTML); }.bind(this));
    $editor.keypress(preventKeyPropagation);
    $editorContainer.hover(toggler.openEditor, toggler.closeEditor);
  }.bind(this);

  var preventKeyPropagation = function(e) { e.stopPropagation(); };

  // stupid CodeMirror doesn't allow you to do this in stylesheets
  var hideScrollbars = function() { $('.CodeMirror-vscrollbar, .CodeMirror-hscrollbar').hide(); };

  this.init();
};
