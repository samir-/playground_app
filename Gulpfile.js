var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('default', function() {
    gulp.src(['./*.css', './*.html', './*.js'])
        .pipe(prettify())
        .pipe(gulp.dest('./'));
});
