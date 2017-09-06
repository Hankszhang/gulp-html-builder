'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var gWatch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');
var build = require('./build/index');

gulp.task('dev', gulpSequence('img', ['less', 'js'], 'tpl:dev', 'localServer', 'watch'));

gulp.task('build:test', gulpSequence('img', ['less', 'js'], 'tpl:test'));
gulp.task('build:prod', gulpSequence('img', ['less', 'js'], 'tpl:prod'));

// 压缩图片
gulp.task('img', function () {
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
// 本地环境
gulp.task('tpl:dev', function () {
    build.tpl2html();
});

// 测试环境
gulp.task('tpl:test', function () {
    build.tpl2html('test');
});

// 发布环境
gulp.task('tpl:prod', function () {
    build.tpl2html('production');
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
