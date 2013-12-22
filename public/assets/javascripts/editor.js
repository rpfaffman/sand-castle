// Editor Namespace

var Editor = {};

Editor.Config = {
  socket: 'assign me',
  editDivSelector: '#sandbox',
  modalSelector: '#edit-modal',
  submitSelector: '#edit-send-button',
  textFieldSelector: '#edit-send-field'
};

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

Editor.Receiver = function(socket) {
  var socket = Editor.Config.socket;

  this.listen = function() {
    socket.on('to_client.edit', function(data) {
      $(data.targetSelector)[0].outerHTML = data.html;
    });
  };
};

Editor.Sender = function() {
  var socket = Editor.Config.socket;
  var sandboxSelector = Editor.Config.editDivSelector;

  this.submit = function(target, html) {
    socket.emit('to_server.edit', {
      html: html,
      targetSelector: getFullSelector($(target))
    });
  };

  // private methods
  var getFullSelector = function($el) {
    var parentElements = $el.parentsUntil(sandboxSelector);
    var parentString = _.map(parentElements, getNodeSelector).reverse().join('>');
    var elementString = getNodeSelector($el);
    return sandboxSelector + ' ' + parentString + '>' + elementString;
  };

  var getNodeSelector = function(el) {
    var $el = $(el);
    var childNumber = getChildNumber($el);
    if ($el.id) {
      return '#' + $el.id;
    } else {
      var selector = $el.prop('tagName');
      return (childNumber > 0) ? selector + ':nth-child(' + childNumber + ')' : selector;
    }
  };

  var getChildNumber = function($el) {
    var tagName = $el.prop('tagName');
    var siblings = $el.parent().children();
    var filteredSiblings = siblings.filter(filterByTag);
    if (filteredSiblings.length == 0) {
      return 0;
    } else {
      for(var i=0; i < siblings.length; i++) {
        if (siblings[i] === $el[0]) { return i + 1; }
      }
    }
    function filterByTag(index) {
      return siblings[index].tagName == tagName;
    };
  };
};

