var fs = require("fs");
var path = require("path");
var execFile = require("child_process").execFile;
var marked = require("marked");
var handlebars = require("handlebars");

var render = require("./render");

module.exports = function(cwd, config) {
  
  // If no specific theme is specified, choose the include, default one.
  var themePath =
      config.theme ?
      config.theme :
      path.join(__dirname, "..", "..", "/app");

  var templateSrc = fs.readFileSync(path.join(themePath, "/index.hbs")).toString();
  var bibliography;

  if (config.bibliography === false)
    bibliography = "";
  else
    bibliography = require(path.join(cwd, "./content/citations.json"));

  // Sort the markdown file names.

  var tableOfContents;
  var titlePage;

  var markdownFiles = fs.readdirSync(path.join(cwd, "/content"));

  // Extract special files
  markdownFiles.forEach(function(filename) {
    if (filename === "title.md")
      titlePage = render(path.join(cwd, "/content/", filename));
    if (filename === "contents.md")
      tableOfContents = render(path.join(cwd, "/content/", filename));
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
 		var pages = render(path.join(cwd, "/content/", file), true);
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
	fs.writeFileSync("./dist/index.html", index);
	fs.writeFileSync("./dist/print.html", print);
  
  execFile(path.join(cwd, "node_modules", ".bin", "gulp"), ["dist"], function(err, stdout, stderr) {
    if (err) console.error(err);
    
    console.log("Building assets with gulp...");
    console.log(stdout);
  });
};