'use strict';

import gulp from 'gulp';
import webserver from 'gulp-webserver';

gulp.task('dev', ['localServer'], () => {});

gulp.task('localServer', () => {
    gulp.src('./src')
    .pipe(webserver({
        host: 'localhost',
        port: 8965,
        directoryListing: true,
        livereload: true,
        open: 'views/test.html'
    }));
});
