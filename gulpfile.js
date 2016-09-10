var gulp = require('gulp'),
	sass = require('gulp-sass'),
	css  = require('gulp-clean-css'),
	rename = require('gulp-rename');


// Compile SASS > Minify CSS
gulp.task('styles', function() {
    gulp.src( './src/scss/**/*.scss' )
        .pipe(sass().on('error', sass.logError))
        .pipe(css())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/css/'))
});

// Watch Tasks
gulp.task('default', function() {
	gulp.watch('./src/scss/**/*.scss',['styles']);
});