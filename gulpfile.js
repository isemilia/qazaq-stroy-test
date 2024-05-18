const gulp = require('gulp');
const browserSync = require('browser-sync');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "app"
        }
    });

    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('watch', function() {
    gulp.watch("app/assets/css/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("app/assets/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("app/assets/fonts/**/*").on('all', browserSync.reload);
    gulp.watch("app/assets/img/unoptimized/*").on('all', gulp.parallel('images'));
});

gulp.task('styles', function() {
    return gulp.src("app/assets/css/sass/*.+(scss|sass)")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("app/assets/css/"))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src("app/assets/img/unoptimized/*")
        .pipe(imagemin())
        .pipe(gulp.dest("app/assets/img/"))
        .pipe(browserSync.stream());
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'images'));