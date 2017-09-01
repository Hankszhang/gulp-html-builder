'use strict';

var gulp = require('gulp');
var through2 = require('through2');
var webserver = require('gulp-webserver');
var gUtil = require('gulp-util');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var gWatch = require('gulp-watch');

var settings = require('./settings');
var render = require('./lib/render');
var mock = require('./lib/mock');

var build = {
    minifyImg: function () {
        gulp.src('src/img/*')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/static/img'));
    },

    less2css: function () {
        gulp.src(settings.lessPath + '/**/*.less')
        .pipe(gWatch('src/less/**/*.less'), {verbose: true, name: 'less-watcher'})
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: settings.browserList
        }))
        .pipe(gulp.dest('./dist/static/css'));
    },

    tpl2html: function () {
        gulp.src([
            settings.viewPath + '/**/*.html',
            '!' + settings.viewPath + '/widgets',
            '!' + settings.viewPath + '/widgets/**'
        ])
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb);
        }))
        .pipe(gulp.dest('./dist'));
    },

    renderTpl: function (path) {
        gulp.src(path.substr(path.indexOf(settings.viewPath + '/')))
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb);
        }))
        .pipe(gulp.dest('./dist'));
    },

    server: function () {
        gulp.src('./dist')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(webserver({
            host: settings.host,
            port: settings.port,
            directoryListing: true,
            livereload: true,
            middleware: mock()
        }));
    }
};

module.exports = build;
