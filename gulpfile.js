'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var gWatch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');
var build = require('./build/index');

gulp.task('dev', gulpSequence(['less', 'js'], 'tpl', 'localServer', 'watch'));

gulp.task('build', gulpSequence(['less', 'js'], 'tpl'));

// 压缩图片
gulp.task('image', function () {
    build.minifyImg();
});

// 编译less文件
gulp.task('less', function () {
    build.less2css();
});

// 编译js文件
gulp.task('js', function () {
    build.js2js();
});

// 编译html模板
gulp.task('tpl', function () {
    build.tpl2html();
});

// 监听文件变化
gulp.task('watch', function () {
    return gWatch('src/views/**/*.html', {verbose: true, name: 'html-watcher'}, function (file) {
        // 添加模板 or 修改通用模板时整个页面都需要重新编译
        if (file.event === 'add' || file.path.indexOf('/widgets/' !== -1)) {
            build.tpl2html();
        }
        // 否则只需编译当前模板
        else {
            build.renderTpl(file.path);
        }
    });
});

// 启动本地server
gulp.task('localServer', function () {
    build.server();
});

// 清理dist文件夹内的所有文件
gulp.task('clean', function () {
    gulp.src('dist/*', {read: false})
    .pipe(clean());
});
