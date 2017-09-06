'use strict';

var path = require('path');
var template = require('art-template');

var config = require('../config');
var utils = require('./utils');

var viewPath = path.join(__dirname, '../../' + config.viewPath);
var locals = require(path.join(viewPath, 'locals.json'));

// config art-template
template.defaults.root = viewPath;
template.defaults.extname = '.html';
template.defaults.encoding = 'utf-8';
template.defaults.debug = true;
template.defaults.bail = true;
// Use in template: $imports.Date $imports.Math ...
template.defaults.imports.Date = Date;
template.defaults.imports.Math = Math;
template.defaults.imports.JSON = JSON;

/**
 * 调用art-template渲染模板
 * @param  {Buffer}   file gulp流的文件
 * @param  {Function} cb   gulp流的回调
 * @return {Buffer}      返回执行回调结果
 */
var render = (file, cb) => {
    var tplStr = file.contents.toString();
    if (file.isNull() || !tplStr) {
        return cb(null, file);
    }
    var tpl = template.render(tplStr, {
        locals: utils.shallowClone({}, locals.common, locals[config.env])
    });
    file.contents = new Buffer(tpl);
    cb(null, file);
};

module.exports = render;
