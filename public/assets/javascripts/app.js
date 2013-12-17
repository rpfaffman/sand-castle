$(document).ready(function() {
  var socket = io.connect(window.location.protocol + '//' + window.location.host);

  // EDITING
  $('#sandbox').click(showEditModal);
  var sandboxSelector = '#sandbox';

  function showEditModal(event) {
    event.stopPropagation();
    var target = event.target;
    var $editModal = $('#edit-modal');
    $('#edit-send-field').val(target.outerHTML);
    $editModal.css({ top: event.pageY, left: event.pageX });
    $editModal.fadeIn(200);
    $('#edit-send-button').off();
    $('#edit-send-button').on('click', function() {
      sendEdit(target);
      $editModal.fadeOut(200);
    }.bind(this));
  };

  // receiving
  socket.on('to_client.edit', function(data) {
    console.log('received a edit event');
    console.log('selector is ' + data.targetSelector);
    $(data.targetSelector)[0].outerHTML = data.html;
  });

  // sending
  function sendEdit(target) {
    console.log('>>> sending edit to the server');
    socket.emit('to_server.edit', {
      sender: $chatAliasField.val(),
      html: $('#edit-send-field').val(),
      targetSelector: getFullSelector($(target))
    });
  };

  // getting unique target selector
  function getFullSelector($el) {
    var parentElements = $el.parentsUntil(sandboxSelector);
    var parentString = _.map(parentElements, getNodeSelector).reverse().join('>');
    var elementString = getNodeSelector($el);
    return sandboxSelector + ' ' + parentString + '>' + elementString;
  };

  function getNodeSelector(el) {
    var $el = $(el);
    var childNumber = getChildNumber($el);
    if ($el.id) {
      return '#' + $el.id;
    } else {
      var selector = $el.prop('tagName');
      return (childNumber > 0) ? selector + ':nth-child(' + childNumber + ')' : selector;
    }
  };

  function getChildNumber($el) {
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

  // CHAT
  var $chat = $('#chat');
  var $chatAliasField = $('#chat-alias-field');
  var $chatSendField = $('#chat-send-field');
  var $chatSendButton = $('#chat-send-button');

  // Receiving
  socket.on('to_client.message', function(data) {
    console.log('Received chat message from ' + data.sender + ': ' + data.message);
  });

  // Sending
  $chatSendButton.on('click', sendChatMessage);
  function sendChatMessage() {
    socket.emit('to_server.message',
                {
                  sender: $chatAliasField.val(),
                  message: $chatSendField.val()
                });
  };
})
