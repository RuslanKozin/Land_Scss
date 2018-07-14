//npm i --save-dev gulp gulp-sass gulp-sourcemaps gulp-autoprefixer gulp-concat gulp-if browser-sync gulp-clean-css
//npm i --save font-awesome
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');
var cleanCss = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

var config = {
    paths: {
        scss: './src/scss/**/*.scss',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        //pathStyle: './public/style',
        path: './public'
    },
    isDevelop: false     // Для финальной версии переключаем на false
};

gulp.task('scss', function() {
    return gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task('serve', function() {
    browserSync.init({
        server: {   
            baseDir: config.output.path
        }
    });

    gulp.watch(config.paths.scss, ['scss']);    // Смотрим за всеми scss-файлами и выполняем задачу scss
    gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', ['scss', 'serve']);