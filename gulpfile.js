var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    fileinclude = require('gulp-file-include'),
    rename      = require('gulp-rename'),
    newer       = require('gulp-newer'),
    notify      = require('gulp-notify'),
    rimraf      = require('gulp-rimraf'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    connect     = require('gulp-connect'),
    server      = lr(),
    path        = require("path");

var paths = {
  templates: './_html_templates/',
  partials: './_html_partials/',
  assets: './assets/',
  sass: './_scss/'
};

function swallowError (error) {
  notify.onError().apply(this, arguments);
  this.emit('end');
}

// clean: uses rimraf to remove build directory
// ==========================================

gulp.task('clean', function (cb) {
  rimraf('./_build/', cb);
});

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
  .pipe(gulp.dest('./_build/'))
  .on('error', swallowError)
  .pipe(livereload());
});

//  compass: compile sass to css
//===========================================
gulp.task('compass', function() {
  gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(compass({
      config_file: './config.rb',
      css: './_build/assets/css/',
      sass: '_scss'
    }))
    .on('error', swallowError)
    .pipe(livereload());
});

//  rebuild: copy any new files
//===========================================

gulp.task('rebuild', function() {
  gulp.src([
    './**', // Copy everything except the following ignores.
    '!./{_*,_*/**}', // Ignore _folders and their contents
    '!./.*', // Ignore dot files.
    '!./config.rb',
    '!./gulpfile.js',
    '!./package.json',
    '!./*.md',
    '!./{node_modules,node_modules/**}'
  ])
    .pipe(gulp.dest('./_build/'));
});


//  connect: sever task
//===========================================
gulp.task('connect', function() {
  connect.server({
    port: 1337,
    root: [__dirname] + '/_build/',
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
  gulp.watch(path.join(paths.assets, '**/*'), ['rebuild']);

});

//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'compass', 'rebuild', 'connect', 'watch']);
