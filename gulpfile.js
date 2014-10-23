// Include Gulp
var EXPRESS_PORT = 3000;
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  minifycss = require('gulp-minify-css'),
  clean = require('gulp-clean');

//Clean
gulp.task('clean', function() {
  return gulp.src(['dist/'], {read: false})
  .pipe(clean());
});


//Lint Task
gulp.task('lint', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('public/js/*.js', ['lint', 'scripts']);
    gulp.watch('public/scss/*.scss', ['sass']);
});


gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname));
  app.listen(3000);
});
gulp.task('default', ['express', 'lint', 'clean', 'scripts', 'watch']);