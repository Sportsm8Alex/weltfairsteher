// Generated by CoffeeScript 1.9.1
(function() {
  var appendResult, entityMap, escapeHtml;

  entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  escapeHtml = function(string) {
    return String(string).replace(/[&<>"'\/]/g, function(s) {
      return entityMap[s];
    });
  };

  appendResult = function(dest, errors) {
    var error, i, len, list, resultDiv;
    resultDiv = $("#" + dest + " > .result");
    if (!resultDiv.length) {
      resultDiv = $("<div class='result'></div>");
      resultDiv.appendTo("#" + dest);
    }
    resultDiv.empty();
    if (errors.length) {
      list = $("<ul></ul>");
      for (i = 0, len = errors.length; i < len; i++) {
        error = errors[i];
        list.append("<li>" + (escapeHtml(error)) + "</li>");
      }
      resultDiv.append(list);
    } else {
      resultDiv.append("<b>Erfolgreich!</b>");
      setTimeout((function() {
        return resultDiv.hide();
      }), 3000);
    }
    resultDiv.show();
  };

  window.callApi = function(api, data, cb) {
    var request;
    request = {
      url: "api/" + api + ".php",
      data: data,
      success: function(errors) {
        console.log(errors);
        errors = JSON.parse(errors);
        return typeof cb === "function" ? cb(errors) : void 0;
      }
    };
    if (data instanceof FormData) {
      request.contentType = false;
      request.processData = false;
    }
    $.post(request);
    return false;
  };

  window.sendForm = function(form) {
    var dest;
    dest = $(form).attr("id");
    window.callApi(dest, $("#" + dest).serialize(), function(errors) {
      return appendResult(dest, errors);
    });
    return false;
  };

  window.sendFile = function(dest) {
    var errors, fd, file, files, i, len, ref;
    fd = new FormData();
    errors = [];
    ref = $("#" + dest + " > :input");
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      files = file.files;
      file = $(file);
      if (file.attr("type") === "file") {
        if (files[0] == null) {
          errors.push("Keine Datei ausgewählt");
        } else {
          fd.append(file.attr("name"), files[0]);
        }
      } else {
        if (file.attr("type") === "radio" && !file.is(":checked")) {
          continue;
        }
        fd.append(file.attr("name"), file.val());
      }
    }
    if (errors.length) {
      appendResult(dest, errors);
      return;
    }
    window.callApi(dest, fd, function(errors) {
      return appendResult(dest, errors);
    });
    return false;
  };

  window.downloadPDF = function(challenge, type) {
    var form;
    form = $("#downloadForm");
    if (!form.length) {
      form = $("<form id='downloadForm' style='display:none' method='POST' action='api/download.php'>\n  <input type=\"hidden\" name=\"challenge\" value=\"" + challenge + "\"></input>\n  <input type=\"hidden\" name=\"type\" value=\"" + type + "\"></input>\n</form>");
      form.appendTo("body");
    }
    form.find("[name='challenge']")[0].value = challenge;
    form.find("[name='type']")[0].value = type;
    return form.submit();
  };

}).call(this);