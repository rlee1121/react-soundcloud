'use strict';

var gulp = require('gulp');
var del = require('del');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babel = require('babelify');
var watchify = require('watchify');

// var rename = require('gulp-rename')
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var chalk = require('chalk');
var merge = require('utils-merge');

var sourceFile = './src/app.js';
var destFolder = './dist/scripts';
var destFileName = 'app.js';

function mapError(err) {
    if (err.fileName) {
    // regular error
        gutil.log(chalk.red(err.name)
          + ': '
          + chalk.yellow(err.fileName.replace(__dirname + '/src/', ''))
          + ': '
          + 'Line '
          + chalk.magenta(err.lineNumber)
          + ' & '
          + 'Column '
          + chalk.magenta(err.columnNumber || err.column)
          + ': '
          + chalk.blue(err.description));
    } else {
    // browserify error..
        gutil.log(chalk.red(err.name)
          + ': '
          + chalk.yellow(err.message));
    }

    this.emit('end');
}

function bundleJs(bundler) {
    return bundler.bundle()
        .on('error', mapError)
        .pipe(source(destFileName))
        .pipe(buffer())
        .pipe(gulp.dest(destFolder))
        // .pipe(rename('app.min.js'))
        .pipe(sourcemaps.init({ loadMaps: true }))
          // capture sourcemaps from transforms
          .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destFolder));
}

gulp.task('watchify', function () {
    var args = merge(watchify.args, { debug: true });
    var bundler = watchify(browserify(sourceFile, args))
        .transform(babel, {presets: ['es2015', 'react']});

    bundleJs(bundler);
    bundler.on('update', function () {
        bundleJs(bundler);
    });
});

// Without watchify
gulp.task('bundle', function () {
    var bundler = browserify(sourceFile, { debug: true })
        .transform(babel, {presets: ['es2015', 'react']});

    return bundleJs(bundler);
});

// Without sourcemaps
gulp.task('browserify-production', function () {
    var bundler = browserify(sourceFile)
        .transform(babel, {presets: ['es2015', 'react']});

    return bundler.bundle()
        .on('error', mapError)
        .pipe(source(destFileName))
        .pipe(buffer())
        // .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destFolder));
});

// Styles
gulp.task('styles', function () {
    return gulp.src('src/assets/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe($.size());
});

// HTML
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('src/assets/img/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/img/'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function (cb) {
    cb(del.sync(['dist/index.html', 'dist/scripts', 'dist/assets']));
});

// Webserver
gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});


// Robots.txt and favicon.ico
gulp.task('extras', function () {
    return gulp.src(['src/*.txt', 'src/*.ico'])
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['watchify', 'serve'], function () {
    // Watch .html files
    gulp.watch('src/*.html', ['html']);

    // Watch .scss files
    gulp.watch('src/assets/styles/**/*.scss', ['styles']);

    // Watch image files
    gulp.watch('src/assets/img/**/*', ['images']);
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras', 'styles']);

// Default task
gulp.task('default', ['clean', 'build']);
