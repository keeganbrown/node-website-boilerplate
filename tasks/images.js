var gulp       = require('gulp')
	imagemin   = require('gulp-imagemin');
 
gulp.task('images', function(){
    return gulp.src('./src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/images'));
});