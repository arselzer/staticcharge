var fs = require("fs");
var marked = require("marked");

module.exports.renderMarkdownFile = function(mdfile, split) {
  var mdString = marked(fs.readFileSync(mdfile).toString());
  if (!split || typeof(split) === "undefined") {
    return mdString;
  }
  else {
    var results = [];
    var hrRegexp = /<hr\s?\/?>/g;
    if (/<hr\s?\/?>/.test(mdString)) {
      var matches = [];
      var match;
      // Push all match indexes
      
      while ((match = hrRegexp.exec(mdString)) !== null) {
        matches.push(hrRegexp.lastIndex);
      }
      
      // Slice HTML into slices
      for (var i = 0, previousIndex = 0; i < matches.length + 1; i++) {
        var cutIndex = 0;
        if (i !== matches.length)
          cutIndex = matches[i];
        else
          cutIndex = mdString.length;
        
        // Slice from start to <hr> and cut off <hr>
        
        var cutAt = 0;
        if (i !== matches.length)
          cutAt = cutIndex - 5;
        else
          cutAt = cutIndex;
        
        results.push(
          mdString
          .slice(previousIndex, cutAt)
        );
        previousIndex = cutIndex;
      }
      return results;
    }
    else {
      results.push(mdString);
      return results;
    }
  }
}