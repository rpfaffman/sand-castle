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

