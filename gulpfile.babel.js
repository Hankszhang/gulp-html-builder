'use strict';

import gulp from 'gulp';

import build from './build/index';

gulp.task('dev', ['less', 'tpl', 'localServer'], () => {});

// 编译less文件
gulp.task('less', () => {
    build.less2css();
});

// 编译html模板
gulp.task('tpl', () => {
    build.tpl2html();
});

// 启动本地server
gulp.task('localServer', () => {
    build.server();
});
