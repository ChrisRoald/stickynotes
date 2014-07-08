self.port.on('strings', function(_strings) {
  stickynotes.strings = _strings;
});

self.port.on('create-sticky', function(sticky) {
  sticky.left = stickynotes.x;
  sticky.top = stickynotes.y;
  var stickyView = stickynotes.createStickyView(sticky);
  document.body.appendChild(stickyView.dom);
  stickynotes.saveSticky(sticky);
  stickynotes.x += 10;
  stickynotes.y += 10;
});
self.port.on('delete-sticky', function(sticky) {
  console.log('page-mod: delete-sticky ' + sticky.id);
  stickynotes.StickyView.deleteDom(sticky);
});
self.port.on('jump-sticky', function(message) {
  console.log('page-mod: jump-sticky');
});
self.port.on('focus-sticky', function(sticky) {
  setTimeout(function() {
    document.getElementById('sticky_id_' + sticky.id).focus();
  }, 500);
});

var load = function(stickies) {
  stickies.forEach(function(s) {
    var view = stickynotes.createStickyView(s);
    document.body.appendChild(view.dom);
  });
};

self.port.on('load-stickies', function(stickies) {
  console.log('page-mod: load-stickies: count=' + stickies.length);
  load(stickies);
});

self.port.on('toggle-visibility', function(stickies) {
  var enabled = stickynotes.StickyView.toggleVisibilityAllStickies(stickies);
  self.port.emit('toggle-menu', enabled);
});

self.port.on('import', function(stickies) {
  console.log('page-mod: imported ' + stickies.length + ' stickies.');
  load(stickies);
});

var watchClickPosition = function(event) {
  stickynotes.x = event.clientX + window.content.pageXOffset;
  stickynotes.y = event.clientY + window.content.pageYOffset;
};
document.addEventListener('mousedown',
                          watchClickPosition,
                          false);
