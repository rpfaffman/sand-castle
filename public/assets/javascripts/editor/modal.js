Editor.Modal = function(sender) {
  var $editDiv = $(Editor.Config.editDivSelector);
  var $modal = $(Editor.Config.modalSelector);
  var $submit = $(Editor.Config.submitSelector);
  var $textField = $(Editor.Config.textFieldSelector);

  this.init = function() {
    $editDiv.click(this.show);
  };

  this.show = function(event) {
    event.stopPropagation();
    event.preventDefault();
    displayModal(event.target);
    assignSendEvent(event.target);
  };

  // private methods
  var displayModal = function(target) {
    $textField.val(target.outerHTML);
    $modal.css({ left: event.pageX, top: event.pageY });
    $modal.fadeIn(200);
  };

  var assignSendEvent = function(target) {
    $submit.off();
    $submit.on('click', function() {
      sender.submit(target, $textField.val());
      $modal.fadeOut(200);
    }.bind(this));
  };

  this.init();
};

