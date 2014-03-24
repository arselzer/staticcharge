var path = require("path");
var express = require("express");

module.exports = function(cwd) {
  var app = express();

	app.use(express.static(path.join(cwd, "/dist")));

	app.listen(8264);
	console.log("Listening on port 8264", cwd);
}