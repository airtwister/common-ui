const gulp = require('gulp');
const browserSync = require('browser-sync');
const iconfont = require('gulp-iconfont');
const iconfontTemplate = require('gulp-iconfont-template');
const consolidate = require('gulp-consolidate');

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

            gulp.src('src/templates/_font-icon.scss')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName,
                    fontDate: new Date().getTime()
                }))

                .pipe(gulp.dest('./dist/css/scss'));

            gulp.src('src/templates/index.html')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName,
                    fontDate: new Date().getTime()
                }))

                .pipe(gulp.dest('./dist/'));
        })
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('styles', function() {
    return gulp.src(['src/css/*.css', 'src/css/*.scss'])
       .pipe(plumber({
           errorHandler: notify.onError(function(err){
               return{
                   title : 'CSS TASK ERROR',
                   message: err.message
               };
           })
       }))
       .pipe(concat('app.css'))
       .pipe(sass.sync())
       .pipe(autoprefixer({
           browsers: ['last 10 versions'],
           cascade: false
       }))
       .pipe(gulp.dest('dist/css'))
       .pipe(browserSync.stream())
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
        startPath: "/index.html"
    });
});

// Default
gulp.task('default', ['fontIcon', 'browser-sync']);