var fs = require("fs");
var marked = require("marked");

module.exports = function renderMarkdownFile(mdfile, split) {
  var mdString = marked(fs.readFileSync(mdfile).toString());
  if (!split || typeof(split) === "undefined") {
    return mdString;
  }
  else {
    var results = [];
    var hr = /<hr\s?\/?>/g;
    if (/<hr\s?\/?>/.test(mdString)) {
      var matches = [];
      var match;
      // Push all match indexes
      
      while ((match = hr.exec(mdString)) !== null) {
        matches.push(hr.lastIndex);
      }
      
      // Slice HTML into slices
      for (var i = 0, previousIndex = 0; i < matches.length + 1; i++) {
        var cutIndex = 0;
        if (i !== matches.length)
          cutIndex = matches[i];
        else
          cutIndex = mdString.length;
        
        // Slice from start to <hr> and cut off <hr>
        
        var sliceIndex = 0;
        if (i !== matches.length)
          sliceIndex = cutIndex - 5;
        else
          cutAt = cutIndex;
        
        results.push(
          mdString
          .slice(previousIndex, sliceIndex)
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