var fs = require("fs");
var marked = require("marked");

var build = require("./build");
var generate = require("./generate");
var serve = require("./serve");

function StaticCharge (directory, theme) {
  this.cwd = directory;
  this.theme = theme;
  
  try {
	this.config = JSON.parse(fs.readFileSync("./config.json").toString());
  } catch(err) {
    console.error(err);
  }
}

StaticCharge.prototype = {
  build: function() {
    build(this.cwd, this.config);
  },
  
  generate: function() {
    generate(this.cwd, function(err) {
      if (err) console.error(err);
    });
  },
  
  serve: function() {
    serve(this.cwd);
  }
};

module.exports = StaticCharge;