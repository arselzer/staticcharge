var config = require("./config.json");
var fs = require("fs");
var marked = require("marked");
var handlebars = require("handlebars");

var StaticCharge = require("./lib/staticcharge");

var templateSrc = fs.readFileSync("./app/index.hbs").toString("utf8");
var bibliography;

if (config.bibliography === false)
  bibliography = "";
else
  bibliography = require("./content/citations.json");

// Sort the markdown file names.

var tableOfContents;
var titlePage;

var markdownFiles = fs.readdirSync("./content");

// Extract special files
markdownFiles.forEach(function(filename) {
  if (filename === "title.md")
    titlePage = StaticCharge.renderMarkdownFile(__dirname + "/content/" + filename);
  if (filename === "contents.md")
    tableOfContents = StaticCharge.renderMarkdownFile(__dirname + "/content/" + filename);
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
  // Split into array at <hr>
  var pages = StaticCharge.renderMarkdownFile(__dirname + "/content/" + file, true);
  pages.forEach(function(page) {
    content.push(page);
  });
});

var data = {
  "title": config.title,
  "titlePage": titlePage,
  "contentsPage": tableOfContents,
  "markdown": content,
  "bibliography": bibliography
};

var printData = {};
// Copy object
Object.keys(data).forEach(function(key) {
  printData[key] = data[key];
});
printData.print = true;

var template = handlebars.compile(templateSrc);

var index = template(data);
var print = template(printData);

console.log("Saving compiled templates.");
fs.writeFileSync("./app/index.html", index);
fs.writeFileSync("./app/print.html", print);
