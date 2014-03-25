var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var readline = require("readline");
var chalk = require("chalk");
var async = require("async");
var ncp = require("ncp").ncp;

module.exports = function generate(cwd, cb) {
  // build script
	fs.readFile(path.join(__dirname, "..", "build.js"), function(err, content) {
    fs.writeFile(path.join(cwd, "build.js"), content, function(err) {
      if (err) cb(err);
    });
  });
  
  // server.js
  fs.readFile(path.join(__dirname, "..", "server.js"), function(err, content) {
    fs.writeFile(path.join(cwd, "server.js"), content, function(err) {
      if (err) cb(err);
    });
  });
  
  // gulpfile.js
  fs.readFile(path.join(__dirname, "..", "default", "gulpfile.js"), function(err, content) {
    fs.writeFile(path.join(cwd, "gulpfile.js"), content, function(err) {
      if (err) cb(err);
    });
  });
  
  // default config
  fs.readFile(path.join(__dirname, "..", "default", "config.json"), function(err, content) {
    fs.writeFile(path.join(cwd, "config.json"), content, function(err) {
      if (err) cb(err);
    });
  });
  
  // example content/
  ncp(path.join(__dirname, "..", "content"), path.join(cwd, "content"), function(err) {
    if (err) cb(err);
  });
  
  // Default theme
  ncp(path.join(__dirname, "..", "app"), path.join(cwd, "app"), function(err) {
    if (err) cb(err);
  });
  
  fs.mkdir("dist", function(err) {
    if (err) cb(err);
  });
  
  var rl = readline.createInterface({
  	input: process.stdin,
   	output: process.stdout
  });
  
  var noDependenciesInstalled;
  
  async.series([
  	function(cb) {
  		// default package.json
  		fs.readFile(path.join(__dirname, "..", "default", "package.default.json"), function(err, content) {
    		fs.writeFile(path.join(cwd, "package.json"), content, function(err) {
      		if (err) cb(err);
          else cb(null);
    		});
  		});
  	},
    
  	function(cb) {
  		rl.question("Install npm dependencies? (y/n)", function(answer) {
    		if (/^\s*(y|yes)\s*$/.test(answer)) {
  				console.log("Installing npm dependencies...");
  				exec("npm install", function(err, stdout, stderr) {
            console.log(stdout);
    				if (err) {
              chalk.red("There was a problem installing the npm packages.");
              cb(err);
            }
            else cb(null);
    			});
    		}
        else {
        	noDependenciesInstalled = true;
        }
        
        cb(null);
  		});
  	},
    
    function(cb) {
      rl.question("Install bower dependencies? (y/n)", function(answer) {
    		if (/^\s*(y|yes)\s*$/.test(answer)) {
  				console.log("Installing bower dependencies...");
  				exec("bower install" + " --config.cwd " + cwd + "/app", function(err, stdout, stderr) {
            console.log(stdout);
    				if (err) {
              chalk.red("You may need to 'npm install -g bower' Dependencies could not be fetched.");
              cb(err);
            }
            else cb(null);
    			});
    		}
        else {
        	noDependenciesInstalled = true;
        }
          
        rl.close();
        cb(null);
  		});
    }
  ], function(err) {
    if (err) console.error(err);
    if (noDependenciesInstalled)
      console.log(chalk.yellow("You might need to install dependencies manually using npm and bower"));
  });
}