var gulp = require("gulp"),
    nodemon = require("gulp-nodemon"),
    jshint = require("gulp-jshint"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer"),
    nodemon = require("gulp-nodemon");

var jsFiles = ["*.js", "app/js/**.js"];
var lessFiles = ["app/less/**.less"];

gulp.task("compileLess", function() {
  gulp.src(lessFiles)
  .pipe(less())
  .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
  .pipe(gulp.dest("app/css"));
});

gulp.task("lint", function() {
  gulp.src(jsFiles)
  .pipe(jshint())
  .pipe(jshint.reporter("default"));
});

gulp.task("server", function() {
  nodemon( {
    script: "./index.js",
    options: "-e js"
  });
});

gulp.task("watch", function() {
  gulp.watch(lessFiles, ["compileLess"]);
  gulp.watch(jsFiles, ["lint"]);
});

gulp.task("dev", ["watch", "server"]);

gulp.task("default", ["lint", "compileLess"]);
