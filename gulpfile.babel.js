'use strict';

import gulp from 'gulp';

import build from './build/index';

gulp.task('dev', ['compile', 'localServer'], () => {});

gulp.task('compile', () => {
    build.compile();
});
gulp.task('localServer', () => {
    build.server();
});
