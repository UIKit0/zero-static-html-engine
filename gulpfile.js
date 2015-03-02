var gulp        = require('gulp'),
    compass     = require('gulp-compass'),
    fileinclude = require('gulp-file-include'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    del         = require('del'),
    changed     = require('gulp-changed'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    path        = require("path");

var paths = {
  templates: './_templates/',
  partials: './_partials/',
  assets: './assets/',
  sass: './_scss/'
};

function swallowError(error) {
  this.emit('end');
}

function reportError(error) {
  notify.onError().apply(this, arguments);
  this.emit('end');
}

// clean: uses del to remove build directory
// ==========================================

gulp.task('clean', function (cb) {
  del('./_build/', cb);
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
  .pipe(reload({stream:true}));
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
    .on('error', reportError)
    .pipe(reload({stream:true}));
});

//  rebuild: copy any new files
//===========================================

gulp.task('rebuild', function() {
  gulp.src([
    path.join(paths.assets, '**')
  ])
    .pipe(changed('./_build/assets/'))
    .pipe(gulp.dest('./_build/assets/'))
    .pipe(reload({stream:true}));
});

//  Browsersync server
//===========================================

gulp.task('browser-sync', function() {
  browserSync({
    reloadDelay: 300,
    notify: {
        styles: [ "position:fixed;top:5px;right:5px;width:10px;height:10px;background:#c82144;border-radius:50%;overflow:hidden;color:#c82144" ]
    },
    server: {
      baseDir: [__dirname] + '/_build/',
    }
  });
});

//  watch: monitor html and static assets updates
//===========================================

gulp.task('watch', function() {

  //Watch task for sass
  gulp.watch(path.join(paths.sass, '**/*.scss'), ['compass']);

  // Watch task for templates, partials, static files
  gulp.watch(path.join(paths.templates, '**/*.html'), ['fileinclude'])
    .on('error', swallowError);
  gulp.watch(path.join(paths.partials, '**/*.html'), ['fileinclude'])
    .on('error', swallowError);
  gulp.watch(path.join(paths.assets, '**/*'), ['rebuild'])
    .on('error', swallowError);

});

//  Default Gulp Task
//===========================================

gulp.task('default', ['fileinclude', 'compass', 'rebuild', 'browser-sync', 'watch']);
