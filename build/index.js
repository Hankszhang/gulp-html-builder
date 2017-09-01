'use strict';

var gulp = require('gulp');
var path = require('path');
var through2 = require('through2');
var webserver = require('gulp-webserver');
var gUtil = require('gulp-util');
var plumber = require('gulp-plumber');
var template = require('art-template');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var gWatch = require('gulp-watch');
var settings = require('./settings');
var mock = require('./lib/mock');
var viewPath = path.join(__dirname, '../' + settings.viewPath);

template.defaults.root = viewPath;
template.defaults.extname = '.html';
template.defaults.encoding = 'utf-8';

var locals = require(path.join(viewPath, 'locals.json'));

// 调用art-template渲染模板
var render = (file, cb) => {
    var tplStr = file.contents.toString();
    if (file.isNull() || !tplStr) {
        return cb(null, file);
    }
    var tpl = template.render(tplStr, {
        locals: Object.assign({}, locals.common, locals.local)
    });
    file.contents = new Buffer(tpl);
    cb(null, file);
};

var build = {
    minifyImg: function () {
        gulp.src('src/img/*')
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/static/img'));
    },

    less2css: function () {
        gulp.src('src/less/**/*.less')
        .pipe(gWatch('src/less/**/*.less'), {verbose: true, name: 'less-watcher'})
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: settings.browserList
        }))
        .pipe(gulp.dest('./dist/static/css'));
    },

    tpl2html: function () {
        gulp.src(['src/views/**/*.html', '!src/views/widgets', '!src/views/widgets/**'])
        .pipe(plumber({errorHandler: gUtil.log}))
        .pipe(through2.obj(function (file, enc, cb) {
            render(file, cb);
        }))
        .pipe(gulp.dest('./dist'));
    },

    renderTpl: function (path) {
        gulp.src(path.substr(path.indexOf('src/views/')))
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
