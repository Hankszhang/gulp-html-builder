'use strict';

import gulp from 'gulp';
import clean from 'gulp-clean';
import gWatch from 'gulp-watch';
import build from './build/index';

gulp.task('dev', ['less', 'tpl', 'localServer', 'watch'], () => {});

// 压缩图片
gulp.task('image', () => {
    build.minifyImg();
});

// 编译less文件
gulp.task('less', () => {
    build.less2css();
});

// 编译html模板
gulp.task('tpl', () => {
    build.tpl2html();
});

// 监听文件变化
gulp.task('watch', () => {
    return gWatch('src/views/**/*.html', {verbose: true, name: 'html-watcher'}, () => {
        build.tpl2html();
    });
});

// 启动本地server
gulp.task('localServer', () => {
    build.server();
});

// 清理dist文件夹内的所有文件
gulp.task('clean', () => {
    gulp.src('dist/*', {read: false})
    .pipe(clean());
});
