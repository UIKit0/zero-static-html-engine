var gulp        = require('gulp'),
    compass     = require('gulp-compass'),
    rename      = require('gulp-rename'),
    notify      = require('gulp-notify'),
    del         = require('del'),
    changed     = require('gulp-changed'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    path        = require("path"),
    swig        = require("gulp-swig"),
    opts        = {
      setup: function(swig) {
        swig.setDefaults({
          cache: false,
          loader: swig.loaders.fs(__dirname + '/partials/') // Set partial path root.
        });
      }
};

var paths = {
  pages: './pages/',
  partials: './partials/',
  assets: './assets/',
  sass: './scss/'
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

// buildPages: grab partials from pages and render html files
// ==========================================

gulp.task('buildPages', function() {
  gulp.src([
    path.join(paths.pages, '**/*.html')
  ])
  .pipe(swig(opts))
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
      sass: 'scss'
    }))
    .on('error', reportError)
    .pipe(reload({stream:true}));
});

//  buildAssets: copy any new files
//===========================================

gulp.task('buildAssets', function() {
  gulp.src([
    path.join(paths.assets, '**/*.*')
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
        styles: [ "position:fixed;top:5px;right:5px;width:10px;height:10px;background:#c82144;border-radius:50%;overflow:hidden;color:#c82144;z-index:99999" ]
    },
    port: 8081,
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

  // Watch task for pages, partials, static files
  gulp.watch(path.join(paths.pages, '**/*.html'), ['buildPages'])
    .on('error', swallowError);
  gulp.watch(path.join(paths.partials, '**/*.html'), ['buildPages'])
    .on('error', swallowError);
  gulp.watch(path.join(paths.assets, '**/*'), ['buildAssets'])
    .on('error', swallowError);

});

//  Default Gulp Task
//===========================================

gulp.task('default', ['buildPages', 'compass', 'buildAssets', 'browser-sync', 'watch']);
