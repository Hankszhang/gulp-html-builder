'use strict';

import gulp from 'gulp';
import path from 'path';
import through2 from 'through2';
import webserver from 'gulp-webserver';
import gUtil from 'gulp-util';
import plumber from 'gulp-plumber';
import template from 'art-template';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import settings from './settings';

const viewPath = path.join(__dirname, '../' + settings.viewPath);

template.defaults.root = viewPath;
template.defaults.extname = '.html';
template.defaults.encoding = 'utf-8';

const locals = require(path.join(viewPath, 'locals.json'));

const build = {
    server: () => {
        gulp.src('./dist')
        .pipe(plumber())
        .pipe(webserver({
            host: settings.host,
            port: settings.port,
            directoryListing: true,
            livereload: true,
            open: 'test.html'
        }));
    },

    less2css: () => {
        gulp.src('src/less/**/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['ie > 8', 'last 2 versions']
        }))
        .pipe(gulp.dest('./dist/static/css'))
        .on('end', () => {
            gUtil.log(gUtil.colors.green('css compiled!'));
        });
    },

    tpl2html: () => {
        gulp.src(['src/views/**/*.html', '!src/views/widgets', '!src/views/widgets/**'])
        .pipe(plumber())
        .pipe(through2.obj((file, enc, cb) => {
            if (file.isNull()) {
                return cb(null, file);
            }
            let tpl = template.render(file.contents.toString(), {
                locals: Object.assign({}, locals.common, locals.local)
            });
            file.contents = new Buffer(tpl);
            cb(null, file);
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', () => {
            gUtil.log(gUtil.colors.green('Html compiled!'));
        });
    }
};

export default build;
