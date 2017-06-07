// including plugins
var gulp = require('gulp'),
    minifyHtml = require("gulp-minify-html"),
    minifyCss = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    ignore = require("gulp-ignore"),
    useref = require('gulp-useref'),                // Index.html scripts concat/min
    gulpif = require('gulp-if'),
    size = require('gulp-size'),                    // Log the output size
    del = require('del')                           // Clean outputs folders/files
;

/*********************************************************
 ***    CONSTANTES
 *********************************************************/
// Set paths and files selectors for tasks
var paths = {
    index:          'index.html',
    partials:       './partials/**/*.html',
    images:         './img/**/*',
    fonts:         ['fonts/**/*','./bower_components/bootstrap/fonts/*'],
    files:         './files/**/*',
    locales:        './js/locales/*',
    dist:           './docs/'
};


// Clean
var taskClean='clean';
gulp.task(taskClean, function (cb) {
    del([paths.dist + '/*'], cb);
});

// task minify partials

var taskMinifyPartials='minify-partials';
gulp.task(taskMinifyPartials, function () {
    gulp.src(paths.partials) // path to your files
        .pipe(minifyHtml())
        .pipe(gulp.dest(paths.dist + 'partials'));
});

// Minify the css, the js files and replace the concatened version from the index.html
var taskMinify = 'minify-deps';
gulp.task(taskMinify, function () {
    return gulp.src(paths.index)
        .pipe(useref())
        .pipe(ignore.exclude([ "**/*.map" ]))
        .pipe(gulpif('*.js', uglify()))
            .on('error', function(err){
         console.error(err);
        })
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(paths.dist))
        .pipe(size({showFiles:true}));
});

// Copy Images
var taskImages = 'copy-images';
gulp.task(taskImages,function() {
    // cache
    return gulp
        .src(paths.images)
        .pipe(gulp.dest(paths.dist + "img"))
    .on('error', function(err){
         console.error(err);
        });
});


// Copy Fonts
var taskFonts = 'copy-fonts';
gulp.task(taskFonts,function() {
    // cache
    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest(paths.dist + "fonts"))
    .on('error', function(err){
         console.error(err);
        });
});

// Copy files
var taskFiles = 'copy-files';
gulp.task(taskFiles,function() {
    // cache
    return gulp
        .src(paths.files)
        .pipe(gulp.dest(paths.dist + "files"))
    .on('error', function(err){
         console.error(err);
        });
});

// Copy files
var taskLocales = 'copy-locales';
gulp.task(taskLocales,function() {
    // cache
    return gulp
        .src(paths.locales)
        .pipe(gulp.dest(paths.dist + "js/locales"))
    .on('error', function(err){
         console.error(err);
        });
});


gulp.task('default', [taskClean, taskMinify, taskMinifyPartials, taskImages, taskFonts, taskFiles, taskLocales]);


