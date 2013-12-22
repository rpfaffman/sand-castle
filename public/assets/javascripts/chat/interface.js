Chat.Interface = function() {
  var $chat = $(Chat.Config.chatDivSelector);
  var $messagesContainer = $chat.find('.messages-container');
  var $inputContainer = $chat.find('.input-container');
  var $input = $(Chat.Config.chatTextSelector);

  var chatTimeout;

  this.renderChatItem = function(alias, message) {
    var $chatItem = $('<div class="container"><div class="chat-item"><span class="alias">' + alias + ':</span> <span class="message">' + message + '</span></div></div>').hide();
    $messagesContainer.stop().animate({ opacity: 1 }, 400).show();
    $chatItem.appendTo($messagesContainer).slideDown(function() {
      clearInterval(chatTimeout);
      $chatItem.find('.chat-item').css('opacity', 1);
      var timeoutLength = message.length * 50; // longer messages have more time before they disappear
      chatTimeout = setTimeout(closeChat, 3000 + timeoutLength);
    });
  };

  this.renderInputBox = function(callback) {
    $inputContainer.slideDown(200, function() {
      $input.focus();
    });
    $input.keypress(function(e) {
      if(e.keyCode === 13) {
        e.stopPropagation();
        callback();
        resetInput();
        $input.blur();
        $inputContainer.slideUp();
      };
    });
  };

  // private methods

  var closeChat = function() {
    $messagesContainer.fadeOut(2000, function() {
      if(!$messagesContainer.is(':visible')) { $messagesContainer.html(''); };
    });
  };

  var resetInput = function() {
    $input.off();
    $input.html('');
  };
};
