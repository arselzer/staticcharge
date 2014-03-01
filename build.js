var config = require("./config.json");
var fs = require("fs");
var marked = require("marked");
var handlebars = require("handlebars");

function readAndRender(mdfile, split) {
  var mdString = marked(fs.readFileSync(__dirname + "/app/content/" + mdfile).toString());
  if (!split || split === "undfined") {
    return mdString;
  }
  else {
    var results = [];
    var hrRegexp = /<hr\s?\/?>/g;
    if (/<hr\s?\/?>/.test(mdString)) {
      var matches = [];
      var match;
      var i = 0;
      // Push all match indexes
      while (match = hrRegexp.exec(mdString) !== null) {
        matches.push(hrRegexp.lastIndex);
      }
      // Slice HTML into slices
      for (var i = 0, previousIndex = 0; i < matches.length; i++) {
        var cutIndex = matches[i] - 5;
        results.push(mdString.slice(previousIndex, cutIndex));
        previousIndex = cutIndex;
      }
      console.log(JSON.stringify(results, null, 2));
      return results;
    }
    else {
      results.push(mdString);
      return results;
    }
  }
}

var templateSrc = fs.readFileSync("./app/index.hbr").toString("utf8");
var footerSrc = fs.readFileSync("./app/footer.md").toString("utf8");
var bibliography = fs.readFileSync("./app/bibliography.html").toString("utf8");

if (config.bibliography === false)
  bibliography = "";

// Sort the markdown file names.

var tableOfContents;
var titlePage;

var markdownFiles = fs.readdirSync("./app/content");

// Extract special files
markdownFiles.forEach(function(filename) {
  if (filename === "title.md")
    titlePage = readAndRender(filename);
  if (filename === "contents.md")
    tableOfContents = readAndRender(filename);
});

var mdFileNames = [];

markdownFiles.forEach(function(file) {
  if (/(\d+)\.md/.test(file))
    mdFileNames.push(parseInt(/(\d+)\.md/.exec(file)[1]));
});

var pageFileNames = 
mdFileNames
.sort()
.map(function(number) {
  return number + ".md";
});

var content = [];

/**
* Read the each of the files in the sorted array,
* and render the markdown. Push the HTML (rendered)
* into the content array.
*/
pageFileNames.forEach(function(file) {
  var pages = readAndRender(file, true);
  pages.forEach(function(page) {
    content.push(page);
  });
});

var footer = marked(footerSrc);

var data = {
  "title": config.title,
  "titlePage": titlePage,
  "contentsPage": tableOfContents,
  "markdown": content,
  "bibliography": bibliography,
  "footer": footer
};

var template = handlebars.compile(templateSrc);

var result = template(data);

console.log("Saving compiled templates.");
fs.writeFileSync("./app/index.html", result);
