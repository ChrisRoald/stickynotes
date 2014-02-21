/**
 *  @fileoverview overlay.js.
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
/**
  * Create sticky element and database.
  */
stickynotes.createSticky = function() {
  var doc = window.content.document;
  if (doc.body === null || doc.body === undefined) {
      return;
  }
  var title = doc.title;
  if (title == '') {
    title = localizedStrings.noTitle;
  }
  var sticky = stickynotes.Sticky.create({
    left: stickynotes.x, top: stickynotes.y,
    width: 150, height: 100,
    url: doc.location.href,
    title: title,
    content: localizedStrings.defaultContent,
    color: 'yellow',
    tags: ''
  });
  var stickyView = stickynotes.createStickyView(sticky);
  doc.body.appendChild(stickyView.dom);
  if (stickynotes.Sidebar.isVisible()) {
    stickynotes.Sidebar.addSticky(sticky);
  }
};
/**
 * Create Sticky element.
 * @param {stickyntoes.Sticky}
 */
stickynotes.createStickyView = function(sticky) {
  var stickyView = new stickynotes.StickyView({
    sticky: sticky,
    onClickDeleteButton: function(e) {
      this.deleteDom();
      this.sticky.remove();
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.deleteSticky(sticky);
      }
    },
    onTextareaChange: function(e) {
      this.sticky.content = this.textarea.value;
      this.sticky.save();
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.updateSticky(sticky);
      }
    },
    onTagTextareaChange: function(e) {
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.deleteSticky(sticky);
      }
      var tags_str = (this.tagBox.value + ',').replace(/^[\s　]+|[\s　]+$/g, '');
      var tags = [];
      var _tags = (tags_str).split(',');
      _tags = _tags.slice(0, _tags.length - 1);
      for (var i = 0; i < _tags.length; i++) {
        _tags[i] = _tags[i].replace(/^[\s　]+|[\s　]+$/g, '');
        if (!_tags[i] == '') {//remove blank str
          var isUnique = true;
          for (var j = 0; j < tags.length; j++) {//remove duplicated str
            if (tags[j] == _tags[i]) {
              isUnique = false;
            }
          }
          if (isUnique)
            tags.push(_tags[i]);
        }
      }
      this.sticky.setTags(tags);
      this.tagBox.value = tags.join(',');
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.addSticky(sticky);
      }
    },
    onMoveEnd: function(e) {
      this.sticky.left = parseInt(this.dom.style.left);
      this.sticky.top = parseInt(this.dom.style.top);
      this.sticky.save();
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.updateSticky(sticky);
      }
    },
    onResizeEnd: function(e) {
      this.sticky.width = parseInt(this.textarea.style.width);
      this.sticky.height = parseInt(this.textarea.style.height) + 7;
      this.sticky.save();
      if (stickynotes.Sidebar.isVisible()) {
        stickynotes.Sidebar.updateSticky(sticky);
      }
    }
  });
  return stickyView;
};
/**
 * Delete Sticky.
 * @param {stickynotes.StickyView}
 */
stickynotes.deleteSticky = function(stickyView) {
  //delete from database
  stickyView.sticky.remove();
  //delete from sidebar
  if (stickynotes.Sidebar.isVisible()) {
    stickynotes.Sidebar.deleteSticky(stickyView.stikcy);
  }
  //delete from content document
  stickyView.deleteDom();
};
/**
 * document onload function.
 */
stickynotes.onload = function(e) {
  var doc = e.target;
  this.addEventListener('unload', function() {
    stickynotes.currentPage = 0;
  },false);
  var current_page = doc.location.href;
  if (stickynotes.currentPage != current_page) {
      stickynotes.currentPage = current_page;
  } else {
    doc.removeEventListener('click',
                            stickynotes.watchClickPosition,
                            false);
  }
  stickynotes.fetchStickies(doc);
  doc.addEventListener('click',
                       stickynotes.watchClickPosition,
                       false);
};
stickynotes.watchClickPosition = function(event) {
    stickynotes.x = event.clientX + window.content.pageXOffset;
    stickynotes.y = event.clientY + window.content.pageYOffset;
};
stickynotes.sweepPreviousStickies = function(doc) {
  var stickyDoms = doc.getElementsByClassName('sticky');
  if (stickyDoms && stickyDoms.length) {
    for (var i = 0, l = stickyDoms.length; i < l; i++) {
      if (stickyDoms[i]) {
        doc.body.removeChild(stickyDoms[i]);
      }
    }
  }
};
stickynotes.fetchStickies = function(doc) {
  var page = stickynotes.Page.fetchByUrl(doc.location.href);

  stickynotes.sweepPreviousStickies(doc);
  if (page === null) return;

  var stickies = stickynotes.Sticky.fetchByPage(page);
  for (var i = 0; i < stickies.length; i++) {
    var stickyView = new stickynotes.createStickyView(stickies[i]);
    doc.body.appendChild(stickyView.dom);
  }
};
/**
 * initialize function.
 */
stickynotes.init = function() {
  window.addEventListener('DOMContentLoaded',
                          stickynotes.onload, false);
  stickynotes.DAO.createTables();
};

window.addEventListener('load', stickynotes.init, false);
Application.console.log('sticky extension loaded');
