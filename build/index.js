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

var config = require('./config');
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
        gulp.src(config.lessPath + '/**/*.less')
        .pipe(gWatch(config.lessPath + '/**/*.less'), {verbose: true, name: 'less-watcher'})
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: config.browserList
        }))
        .pipe(gulp.dest('./dist/static/css'));
    },

    js2js: function () {
        gulp.src(config.jsPath + '/**/*.js')
        .pipe(gWatch(config.jsPath + '/**/*.js'), {verbose: true, name: 'js-watcher'})
        .pipe(plumber({errorHandler: gUtil.log}))
        // to do production editon
        .pipe(gulp.dest('./dist/static/js'));
    },

    tpl2html: function (env) {
        var distPath = env ? './dist/' + env : './dist';
        gulp.src([
            config.viewPath + '/**/*.html',
            '!' + config.viewPath + '/widgets',
            '!' + config.viewPath + '/widgets/**'
        ])
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb, env);
        }))
        .pipe(gulp.dest(distPath));
    },

    renderTpl: function (path) {
        gulp.src(path.substr(path.indexOf(config.viewPath + '/')))
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb, 'local');
        }))
        .pipe(gulp.dest('./dist'));
    },

    server: function () {
        gulp.src('./dist')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(webserver({
            host: config.host,
            port: config.port,
            directoryListing: true,
            livereload: true,
            middleware: mock
        }));
    }
};

module.exports = build;
