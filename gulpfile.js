var gulp = require('gulp'),
	sass = require('gulp-sass'),
	css  = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

// Minify JS
gulp.task('scripts', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
});

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
	gulp.watch('./src/js/**/*.js',['scripts']);
});