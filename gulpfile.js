// Include Gulp
var EXPRESS_DIR = '/';

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


gulp.task('build-to-examples', ['clean', 'build'], function(event) {
  gulp.src([
    'public/js/app.js',
    'public/js/appRoutes.js',
    'public/js/controllers/*.js',
  ])
  .pipe(concat('famous-angular.js'))
  .pipe(gulp.dest('public/bower_components/famous-angular/dist/'));
  return gulp.src('public/styles/famous-angular.css')
  .pipe(gulp.dest(EXPRESS_DIR + 'public/bower_components/famous-angular/dist/'))
  .pipe(notify({ message: 'Build task complete' }));

})

// Watch
gulp.task('watch-examples', function(event) {
  var livereload = require('gulp-livereload');
  var server = livereload();
  // Watch .js files
  gulp.watch([
      'public/scripts/*/**/*.js',
      EXPRESS_DIR + '/*'
    ],
    ['build-to-examples', 'build']
  ).on('change',
    function(file){
      server.changed(file.path);
    }
  );
});



//default
gulp.task('dev', ['build-to-examples'], function() {
  var express = require('express');
  var app = express();
  require('./app/routes')(app);
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname + '/public'));
  app.listen(EXPRESS_PORT);
  gulp.start('watch-examples');
});