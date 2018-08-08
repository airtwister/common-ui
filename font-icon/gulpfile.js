const gulp = require('gulp');
const browserSync = require('browser-sync');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

gulp.task('fontIcon', function () {
    return gulp.src('src/icons/*.svg')
        .pipe(iconfont({
            fontName: 'font-icon',
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            appendCodepoints: true,
            prependUnicode: true,
            normalize: true,
            fontHeight: 1000,
            centerHorizontally: true
        }))
        .on('glyphs', function (glyphs, options) {
            glyphs.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            // scss для экспорта
            gulp.src('src/templates/_font-icon.scss')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName,
                    fontDate: new Date().getTime()
                }))
                .pipe(gulp.dest('./dist/scss'))
                .on('end', () => {
                    // шаблон для демо
                    gulp.src('src/templates/index.html')
                        .pipe(consolidate('underscore', {
                            glyphs: glyphs,
                            fontName: options.fontName,
                            fontDate: new Date().getTime()
                        }))
                        .pipe(gulp.dest('./public/'));

                    // стили для демо
                    gulp.src(['dist/scss/_font-icon.scss', 'src/templates/app.scss'])
                        .pipe(plumber({
                            errorHandler: (err) => {
                                console.error('CSS TASK ERROR: ', err.message)
                            }
                        }))
                        .pipe(concat('app.css'))
                        .pipe(sass.sync())
                        // стили для демо
                        .pipe(gulp.dest('public/'));
                });
        })
        // шрифты для экспорта
        .pipe(gulp.dest('dist/fonts'))
        // шрифты для демо
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "public"
        },
        startPath: "/index.html"
    });
});

gulp.task('icons', ['fontIcon', 'browser-sync']);
