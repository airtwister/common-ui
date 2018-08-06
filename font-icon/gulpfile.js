var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    include = require('gulp-html-tag-include'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    ftp = require('gulp-ftp'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    svgSprite = require('gulp-svg-sprite'),
    iconfont = require('gulp-iconfont');

var iconfontCss = require('gulp-iconfont-css');
var iconfontTemplate = require('gulp-iconfont-template');
var async = require('async');
var consolidate = require('gulp-consolidate');

config = {
    dest: '',
    mode: {
        css: {
            dest: 'css',
            sprite: '../images/svg/sprite.svg',
            render: {
                scss: {
                    dest: '../../src/css/svg-sprite'
                }
            }
        }
    }
};
gulp.task("svgSprite", function() {
    return gulp.src('src/images/svg-sprite/*.svg', {cwd: ''})
        .pipe(plumber())
        .pipe(svgSprite(config))
        .on('error', function(error){
           console.log('someting wrong');
        })
        .pipe(gulp.dest('public'));
});

var fontName = 'Icons';

gulp.task('fontIcon', function () {
    return gulp.src('src/images/i/*.svg')
        // .pipe(iconfontTemplate({
        //     fontName: 'font-icon',
        //     path: 'src/css/templates/template.html',
        //     targetPath: 'template.html'
        // }))
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
            gulp.src('src/css/templates/icon-font.scss')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName,
                    fontDate: new Date().getTime()
                }))

                .pipe(gulp.dest('./src/css/'));
        })
        .pipe(gulp.dest('public/css/fonts'));
});

gulp.task("images", function() {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));
});

gulp.task('html', function() {
    return gulp.src(['./src/pages/html/**', '!./src/pages/components/'])
        .pipe(include())
        .pipe(gulp.dest('./public'));
});

gulp.task('bower_components', function() {
    return gulp.src(['src/js/vendor/jquery.js','src/js/vendor/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return{
                    title : 'JS TASK ERROR',
                    message: err.message
                };
            })
        }))
        .pipe(concat('vendor.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/*.js'])
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return{
                    title : 'JS TASK ERROR',
                    message: err.message
                };
            })
        }))
        //.pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.stream());
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
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream())
});

gulp.task('bower_components_css', function() {
    return gulp.src(['src/css/vendor/*.css'])
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return{
                    title : 'CSS TASK ERROR',
                    message: err.message
                };
            })
        }))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream())
});

// Watch
gulp.task('watch',function(){
    gulp.watch("./src/js/*.js", ['scripts']);
    gulp.watch(["./src/css/*.scss", "./src/css/*.css"], ['styles']);
    gulp.watch(['src/pages/**/**.html', 'src/pages/**/**.html'], ['html']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "public"
        },
        startPath: "/index.html"
    });
});

// Default
gulp.task('default', ['html', 'scripts', 'fontIcon', 'svgSprite', 'images', 'styles', 'bower_components', 'bower_components_css', 'browser-sync', 'watch']);