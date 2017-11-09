var gulp = require('gulp'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    filesize = require('gulp-filesize'),
    path = require('path'),
    watch = require('gulp-watch'),
    help = require('gulp-task-listing'),
    runSequence = require('run-sequence');


/**
 * The default + help tasks
 */
gulp.task('default', help);
gulp.task('help', help);

/**
 * The default build task
 */
gulp.task('build', function(callback) {
    runSequence(
        'build-vendor-js',
        'build-vendor-css',
        'build-js',
        'build-css'
    );
});

/**
 * Builds the app's javascript
 */
gulp.task('build-js', function() {
    return gulp.src('./js/main.js')
        .pipe(gulp.dest('./js'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(filesize())
        .pipe(gulp.dest('./js'));
});

/**
 * Builds the app's stylesheets from the less files
 */
gulp.task('build-css', function() {
    return gulp.src('./css/main.css')
        .pipe(autoprefixer('last 2 versions'))
        .pipe(filesize())
        .pipe(gulp.dest('./css'))
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(filesize())
        .pipe(gulp.dest('./css'));
});

/**
 * Builds the vencors javascript
 */
gulp.task('build-vendor-js', function() {
    return gulp.src('./js/vendor/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./js'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(filesize())
        .pipe(gulp.dest('./js'));
});

/**
 * Builds the app's stylesheets from the less files
 */
gulp.task('build-vendor-css', function() {
    return gulp.src('./css/vendor/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./css'))
        .pipe(filesize())
        .pipe(cleanCSS())
        .pipe(rename('vendor.min.css'))
        .pipe(filesize())
        .pipe(gulp.dest('./css'));
});

/**
 * Starts the watcher for changed files in the build dir
 */
gulp.task('watch', function() {
    runSequence(
        [ 'watch-css', 'watch-js' ]
    );
});

/**
 * Starts the watcher for changed files app's less files
 */
gulp.task('watch-css', function() {
    watch({glob: './css/*.css'}, function(files) {
        return gulp.src('./css/main.css')
            .pipe(autoprefixer('last 2 versions'))
            .pipe(gulp.dest('./css'))
            .pipe(cleanCSS())
            .pipe(rename('main.min.css'))
            .pipe(gulp.dest('./css'));
    });
});

/**
 * Starts the watcher for changed files app's js files
 */
gulp.task('watch-js', function() {
    watch({glob: './js/*.js'}, function(files) {
        return gulp.src('./js/main.js')
            .pipe(gulp.dest('./js'))
            .pipe(uglify())
            .pipe(rename('main.min.js'))
            .pipe(gulp.dest('./js'));
    });
});


