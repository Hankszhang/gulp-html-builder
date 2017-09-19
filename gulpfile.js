'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var gWatch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');
var build = require('./build/index');

// 本地开发
gulp.task('local', gulpSequence('clean', 'img', ['less', 'js'], 'tpl', 'localServer', 'watch'));

// dev环境
gulp.task('dev', gulpSequence('clean', 'env:dev', 'img', ['less', 'js'], 'tpl'));

// 测试环境需要同时编译oa环境和发布环境的两份代码
gulp.task('test', gulpSequence('clean', 'oa', 'prod'));
gulp.task('oa', gulpSequence('env:test', 'img', ['less', 'js'], 'tpl'));
gulp.task('prod', gulpSequence('env:prod', 'img', ['less', 'js'], 'tpl'));

// 设置dev环境变量
gulp.task('env:dev', function () {
    process.env.NODE_INNER = 'development';
});

// 设置oa环境变量
gulp.task('env:test', function () {
    process.env.NODE_INNER = 'test';
});
// 设置发布环境变量
gulp.task('env:prod', function () {
    process.env.NODE_INNER = 'production';
});

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
    return gulp.src('dist/*', {read: false})
    .pipe(clean());
});
