'use strict';

import gulp from 'gulp';
import webserver from 'gulp-webserver';
import gUtil from 'gulp-util';
import plumber from 'gulp-plumber';
import through2 from 'through2';
import path from 'path';
import settings from './settings';
import template from 'art-template';
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

    compile: () => {
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
        .pipe(gulp.dest('./dist'));
    }
};

export default build;
