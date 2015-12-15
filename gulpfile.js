var gulp = require('./tasks')([
    'webpack',
    'less',
    'images',
    'seed-db',
    'serve'
]);
 
gulp.task('seed', ['seed-db']);
gulp.task('build', ['webpack', 'less', 'images']);
gulp.task('build-dev', ['webpack:dev', 'less:dev', 'images']);
gulp.task('dev', ['build-dev', 'serve']);
gulp.task('default', ['build']);
