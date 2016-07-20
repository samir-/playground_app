var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('default', function() {
    gulp.src(['./public/css/*.css', './public/html/*.html', './*.js'])
        .pipe(prettify())
        .pipe(gulp.dest('./'));
});
