var path = require("path"),
		gulp = require("gulp"),
    exec = require("child_process").exec,
    nodemon = require("gulp-nodemon"),
    jshint = require("gulp-jshint"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer");

var jsFiles = [
	"*.js",
	"app/js/*.js"
];

var templateFiles = [
	"app/*.hbr",
	"app/*.md",
	"content/*.md"
];

var lessFiles = "./app/less/*.less";

gulp.task("compile-less", function() {
  gulp.src(lessFiles)
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(gulp.dest("app/css"));
});

gulp.task("lint", function() {
  gulp.src(jsFiles)
  .pipe(jshint())
  .pipe(jshint.reporter("default"));
});

gulp.task("server", function() {
  nodemon({
    script: "./server.js",
    options: "-e js"
  });
});

gulp.task("watch", function() {
  gulp.watch(lessFiles, ["compile-less"]);
  gulp.watch(jsFiles, ["lint"]);
  gulp.watch(templateFiles, ["compile"]);
});

gulp.task("move-to-dist", function() {
  gulp.src("app/css/*.css")
  .pipe(gulp.dest("dist/css/"));
  
  gulp.src("app/images/*")
  .pipe(gulp.dest("dist/images/"));
  
  gulp.src("app/js/*.js")
  .pipe(gulp.dest("dist/js"));
  
  gulp.src(["app/*.html", "app/*.json", "app/*.hbr"])
  .pipe(gulp.dest("dist/"));
  
  gulp.src("app/bower_components/**")
  .pipe(gulp.dest("dist/bower_components/"));
});

gulp.task("dev", ["watch", "server", "compile-less"]);

gulp.task("default", ["lint", "compile-less"]);

gulp.task("dist", ["move-to-dist"]);
