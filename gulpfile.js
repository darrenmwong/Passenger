// Include Gulp
var EXPRESS_PORT = 3000;
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  minifycss = require('gulp-minify-css'),
  ngAnnotate = require('gulp-ng-annotate'),
  clean = require('gulp-clean'),
  notify = require('gulp-notify'),
  pkg = require('./package.json');


//Clean
gulp.task('clean', function() {
  return gulp.src(['dist/'], {read: false})
  .pipe(clean());
});


//Build for dist
gulp.task('build', ['clean'], function(event) {
  var header = require('gulp-header');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');


  // Build the CSS
  gulp.src([
    'public/styles/famous-angular.css'
  ])
  .pipe(gulp.dest('dist/'))
  .pipe(minifycss())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/'));


  // Build the JS
  return gulp.src([
    'public/js/app.js',
    'public/js/appRoutes.js',
    'public/js/controllers/*.js',

  ])
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  .pipe(concat('famous-angular.js'))
  .pipe(ngAnnotate())
  .pipe(gulp.dest('dist/'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist/'))
  .pipe(notify({ message: 'Build task complete' }));
});



//Lint Task
gulp.task('lint', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('public/js/*.js')
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


gulp.task('default', ['clean', 'build'], function(event) {
  gulp.src([
    'public/js/app.js',
    'public/js/appRoutes.js',
    'public/js/controllers/*.js',
  ])
  .pipe(concat('famous-angular.js'))
  // .pipe(gulp.dest('app/bower_components/famous-angular/dist/'));

  // return gulp.src('src/styles/famous-angular.css')
  // .pipe(gulp.dest(EXAMPLES_DIR + 'app/bower_components/famous-angular/dist/'))
  // .pipe(notify({ message: 'Build task complete' }));

})