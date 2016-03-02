define(['require'], function (require) {
  "use strict";
  var $ = require('jquery');
  var Jupyter = require('base/js/namespace');
  var events = require('base/js/events');
  var utils = require('base/js/utils');
  var CodeCell = require('notebook/js/codecell').CodeCell;
  var CodeMirror = require('codemirror/lib/codemirror');

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

  var Todo = function (nb) {
    var todo = this;
    this.notebook = nb;

    console.log(CodeCell.code_mirror);
    CodeCell.prototype.create_element.code_mirror.addOverlay(todoHighlightOverlay);

  };

  function setup_todo () {
    // lazy, hook it up to Jupyter.notebook as the handle on all the singletons
    console.log("Setting up todo extension");
    return new Todo(Jupyter.notebook);
  }

  function load_extension () {
    // add css
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = require.toUrl("./todo.css");
    document.getElementsByTagName("head")[0].appendChild(link);
    // load when the kernel's ready
    if (Jupyter.notebook.kernel) {
      setup_todo();
    } else {
      events.on('kernel_ready.Kernel', setup_todo);
    }
  }

  return {
    load_ipython_extension: load_extension,
  };
});