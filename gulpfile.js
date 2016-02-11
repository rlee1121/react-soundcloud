'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babel = require('babelify');
var watchify = require('watchify');
var mainBowerFiles = require('main-bower-files');
var source = require('vinyl-source-stream'),
    sourceFile = './src/app.js',
    destFolder = './dist/scripts',
    destFileName = 'app.js';


// Styles
gulp.task('styles', function () {
    return gulp.src('src/assets/styles/main.scss')
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['src/vendor']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe($.size());
});


// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
    })).transform(babel, {presets: ['es2015', 'react']});

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source(destFileName))
            .pipe(gulp.dest(destFolder));
    }

    return rebundle();

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

gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('src/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});

// Clean
gulp.task('clean', function (cb) {
    cb(del.sync(['dist/index.html', 'dist/vendor', 'dist/scripts', 'dist/assets']));
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function(){
    return gulp.src('./src/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('dist'));
});

// Webserver
gulp.task('serve', function () {
    gulp.src('./dist')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src(mainBowerFiles(), {base: 'src/vendor'})
        .pipe(gulp.dest('dist/vendor/'));

});

gulp.task('json', function() {
    gulp.src('src/json/**/*.json', {base: 'src'})
        .pipe(gulp.dest('dist/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
    return gulp.src(['src/*.txt', 'src/*.ico'])
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['build', 'serve'], function () {

    // Watch .json files
    gulp.watch('src/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('src/*.html', ['html']);

    // Watch .scss files
    gulp.watch('src/assets/styles/**/*.scss', ['styles']);

    // Watch image files
    gulp.watch('src/assets/img/**/*', ['images']);
});

// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras']);

// Default task
gulp.task('default', ['clean', 'build', 'jest' ]);
