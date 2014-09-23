var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    fileinclude = require('gulp-file-include'),
    rename      = require('gulp-rename'),
    newer       = require('gulp-newer'),
    notify      = require('gulp-notify'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    connect     = require('gulp-connect'),
    server      = lr(),
    path        = require("path");

var paths = {
  templates: './html_templates/',
  partials: './html_partials/',
  assets: './assets/',
  sass: './scss/'
};

function swallowError (error) {
  notify.onError().apply(this, arguments);
  this.emit('end');
}

// fileinclude: grab partials from templates and render html files
// ==========================================
gulp.task('fileinclude', function() {
  gulp.src(path.join(paths.templates, '**/*.tpl.html'))
  .pipe(fileinclude({
    basepath: '@root'
  }))
  .pipe(rename({
    extname: ""
  }))
  .pipe(rename({
    extname: ".html"
  }))
  .pipe(gulp.dest('./_site/'))
  .on('error', swallowError)
  .pipe(livereload());
});

//  compass: compile sass to css
//===========================================
gulp.task('compass', function() {
  gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(compass({
      config_file: './config.rb',
      css: './_site/assets/css/',
      sass: 'scss'
    }))
    .on('error', swallowError)
    .pipe(livereload());
});

//  copy_assets: copy only new static assets
//===========================================

gulp.task('copy_assets', function() {
  gulp.src('assets/**/*')
    .pipe(newer('_site/assets/'))
    .pipe(gulp.dest('_site/assets/'))
    .pipe(livereload());
});

//  connect: sever task
//===========================================
gulp.task('connect', function() {
  connect.server({
    port: 1337,
    root: [__dirname] + '/_site/',
    livereload: false
  });
});

//  watch: monitor html and static assets updates
//===========================================
gulp.task('watch', function() {
  //Watch task for sass
  gulp.watch(path.join(paths.sass, '**/*.scss'), ['compass']);

  // watch task for templates, partials, static files
  gulp.watch(path.join(paths.templates, '**/*.html'), ['fileinclude']);
  gulp.watch(path.join(paths.partials, '**/*.html'), ['fileinclude']);
  gulp.watch(path.join(paths.assets, '**/*.{png,jpg,jpeg,css,js,html}'), ['copy_assets']);

});

//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'compass', 'copy_assets', 'connect', 'watch']);
