'use strict';

var gulp = require('gulp');
var through2 = require('through2');
var gUtil = require('gulp-util');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var gWatch = require('gulp-watch');
var browserSync = require('browser-sync').create();

var config = require('./config');
var render = require('./lib/render');
var mock = require('./lib/mock');

var build = {
    minifyImg: function () {
        var env = process.env.NODE_INNER || 'local';
        var distPath = config.targetPath[env] + '/static/img';
        return gulp.src('src/img/*')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(imagemin())
        .pipe(gulp.dest(distPath));
    },

    less2css: function () {
        var env = process.env.NODE_INNER || 'local';
        var distPath = config.targetPath[env] + '/static/css';
        if (env === 'local') {
            return gulp.src(config.lessPath + '/**/*.less')
            .pipe(gWatch(config.lessPath + '/**/*.less'), {verbose: true, name: 'less-watcher'})
            .pipe(plumber({errorHandler: gUtil.log}))
            .pipe(less())
            .pipe(autoprefixer({
                browsers: config.browserList
            }))
            .pipe(gulp.dest(distPath));
        }
        return gulp.src(config.lessPath + '/**/*.less')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: config.browserList
        }))
        .pipe(gulp.dest(distPath));
    },

    js2js: function () {
        var env = process.env.NODE_INNER || 'local';
        var distPath = config.targetPath[env] + '/static/js';
        if (env === 'local') {
            return gulp.src(config.jsPath + '/**/*.js')
            .pipe(gWatch(config.jsPath + '/**/*.js'), {verbose: true, name: 'js-watcher'})
            .pipe(plumber({errorHandler: gUtil.log}))
            .pipe(gulp.dest(distPath));
        }
        return gulp.src(config.jsPath + '/**/*.js')
        .pipe(plumber({errorHandler: gUtil.log}))
        // to do production editon
        .pipe(gulp.dest(distPath));
    },

    tpl2html: function () {
        var env = process.env.NODE_INNER || 'local';
        var distPath = config.targetPath[env];
        return gulp.src([
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
        var distPath = config.targetPath.local;
        gulp.src(path.substr(path.indexOf(config.viewPath + '/')))
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb, 'local');
        }))
        .pipe(gulp.dest(distPath));
    },

    server: function () {
        browserSync.init({
            server: {
                baseDir: config.targetPath.local,
                middleware: mock
            },
            host: config.host,
            port: config.port,
            ui: false,
            open: false,
            watchOptions: {
                ignoreInitial: false
            },
            files: ['dist/development/**/*.*']
        });
    }
};

module.exports = build;
