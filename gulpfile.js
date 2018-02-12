const gulp = require("gulp");
const path = require("path");
var exec = require('child_process').exec;

function checker() {
    exec('node nasdaq_checker' ) ;
}

function rest() {
    exec('node nasdaq_rest' ) ;
}

function execFiles() {
    checker() ;
    rest() ;
}

function watch() {
    gulp.watch( '*.js', execFiles);
}

gulp.task("watch", watch);
gulp.task("default", execFiles ) ;

