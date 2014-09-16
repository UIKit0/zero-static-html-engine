var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    fileinclude = require('gulp-file-include'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    connect     = require('gulp-connect'),
    server      = lr(),
    path        = require("path");

var paths = {
  templates: './templates/',
  partials: './partials/',
  assets: './assets/',
  sass: './scss/'
};

//  Copy Static Assets
//===========================================
gulp.task('copy_assets', function() {
  gulp.src('assets/**/*')
    .pipe(gulp.dest('out/assets/'))
    .pipe(livereload(server))
});

// fileinclude: grab partials from templates and render out html files
// ==========================================
gulp.task('fileinclude', function() {
  return gulp.src(path.join(paths.templates, '*.tpl.html'))
  .pipe(fileinclude())
  .pipe(rename({
    extname: ""
  }))
  .pipe(rename({
    extname: ".html"
  }))
  .pipe(gulp.dest('./out/'))
  .pipe(livereload(server))
  .pipe(notify({ message: 'Includes: included' }));
});

//  Sass: compile sass to css task - uses Libsass
//===========================================
gulp.task('compass', function() {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(compass({
      config_file: './config.rb',
      css: './out/assets/css/',
      sass: 'scss'
    }))
    .pipe(livereload(server))
    .pipe(notify({ message: 'CSS Compiled' }));
});

//  Connect: sever task
//===========================================
gulp.task('connect', function() {
  connect.server({
    port: 1337,
    root: [__dirname] + '/out/',
    livereload: false
  });
});

function watchStuff() {
  // Listen on port other than 35729
  server.listen(35728, function (err) {
    if (err) {
      return console.error(err)
      //TODO use notify to log a message on Sass compile fail and Beep
    };

    //Watch task for sass
    gulp.watch(path.join(paths.sass, '**/*.scss'), ['compass']);

    // watch task for templates, partials, static files
    gulp.watch(path.join(paths.templates, '**/*.html'), ['fileinclude']);
    gulp.watch(path.join(paths.partials, '**/*.html'), ['fileinclude']);
    gulp.watch(path.join(paths.assets, '**/*.{png,jpg,jpeg,css,js}'), ['copy_assets']);

  });
}

//  Watch and Livereload using Compass
//===========================================
gulp.task('watch', function() {

  watchStuff();

});

//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'compass', 'copy_assets', 'connect', 'watch'], function() {

});