var gulp = require('gulp'),
    gutil = require("gulp-util"),
    less = require('gulp-less'),
    path = require('path');

gulp.task('less', function () {
  return gulp.src('./src/css/*.less')
            .pipe(less())
            .pipe(minifyCSS())
            .pipe(gulp.dest('./public/bin'));
});


// Using a gulp plugin to minify css
var minifyCSS = require('gulp-minify-css');

gulp.task('less:dev', function (callback) {
    less_dev_build(callback);
    gulp.watch(["./src/css/*.less", "./src/css/*.css"], function () {
        try {
            less_dev_build(callback);
        } catch (e) {
            console.log('Less Rebuild Caught Error: ', e, 'Waiting to restart.')
        }
    });
});

function less_dev_build (callback) {
    gutil.log("[less:dev] Rebuilding");
    gulp.src('./src/css/*.less')
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./public/bin'))
        .on('error', function (err) {
            console.log(err);
        });
}
