define(['require'], function (require) {
  "use strict";
  var Jupyter = require('base/js/namespace');
  var CodeCell = require('notebook/js/codecell').CodeCell;

  var todoHighlightOverlay = {
    token: function(stream) {
      if (stream.pos == 0) {
        var re = /\b(to\s*do|fix\s*me|hack)\b/i;
        var match = re.exec(stream.string);
        if (match) {
          stream.skipToEnd();
          return "highlight";
        }
      }
      stream.skipToEnd();
    }
  };

  function setup_todo () {
    // Add overlay to future CodeCells
    var old_create_element = CodeCell.prototype.create_element;
    CodeCell.prototype.create_element = function () {
      old_create_element.apply(this, arguments);
      this.code_mirror.addOverlay(todoHighlightOverlay);
    }

    // Add overlay to all existing CodeCells
    Jupyter.notebook.get_cells().map( function(cell) {
      if (cell.cell_type == 'code') { cell.code_mirror.addOverlay(todoHighlightOverlay); }
      return cell;
    });
  }

  function load_extension () {
    // add css
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./todo.css");
    document.getElementsByTagName("head")[0].appendChild(link);

    setup_todo();
  }

  return {
    load_ipython_extension: load_extension
  };
});
