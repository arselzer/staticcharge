var config = require("./config.json");
var fs = require("fs");
var markdown = require("markdown").markdown;
var handlebars = require("handlebars");

var templateSrc = fs.readFileSync("./app/index.hbr").toString("utf8");
var markdownSrc = fs.readFileSync("./app/content.md").toString("utf8");
var footerSrc = fs.readFileSync("./app/footer.md").toString("utf8");
var bibliography = fs.readFileSync("./app/bibliography.html").toString("utf8");

if (config.bibliography === false)
  bibliography = "";

var content = markdown.toHTML(markdownSrc);
var footer = markdown.toHTML(footerSrc);

var data = {
  "markdown": content,
  "bibliography": bibliography,
  "footer": footer
}

var template = handlebars.compile(templateSrc);

var result = template(data);

console.log("Saving compiled templates.");
fs.writeFileSync("./app/index.html", result);
