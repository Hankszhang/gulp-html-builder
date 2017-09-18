'use strict';

var path = require('path');
var url = require('url');
var fs = require('fs');
var gUtil = require('gulp-util');

module.exports = function (req, res, next) {
    function response(code, body) {
        try {
            res.writeHead(code, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'application/json'
            });
            res.end(body);
        }
        catch (e) {
            gUtil.log(gUtil.colors.red(e));
            return;
        }
    }

    var pathname = url.parse(req.url).pathname;
    var filePath = path.normalize('../../dev/mock/' + pathname);

    if (pathname.match(/(.+).html$/)) {
        gUtil.log('Template request: ', gUtil.colors.green(pathname));
    }
    // 不是api或stores开头的请求，直接next
    if (!pathname.match(/^\/api|^\/store/)) {
        next();
        return;
    }

    try {
        var resolvedPath = path.resolve(__dirname, filePath);

        gUtil.log('Ajax request: ', gUtil.colors.green(pathname));
        // 支持RESTful API
        if (fs.existsSync(resolvedPath)
            && fs.statSync(resolvedPath).isDirectory()) {
            if (req.method === 'GET') {
                filePath += '/read';
            }
            else if (req.method === 'POST') {
                filePath += '/create';
            }
            else if (req.method === 'PUT') {
                filePath += '/update';
            }
            else if (req.method === 'DELETE') {
                filePath += '/delete';
            }
        }
        delete require.cache[require.resolve(filePath)];
        var data = require(filePath);
        if (typeof data === 'function') {
            if (req.method === 'GET' || req.method === 'DELETE') {
                data = data(url.parse(req.url, true).query);
            }
            else if (req.method === 'POST' || req.method === 'PUT') {
                data = data(req.body);
            }
        }
        var body = JSON.stringify(data.body);
        setTimeout(function () {
            response(data.statusCode, body);
        }, 300);
    }
    catch (e) {
        gUtil.log(gUtil.colors.red(e));
        data = {
            statusCode: 500,
            body: {
                r: 10001,
                msg: '缺少mock数据'
            }
        };
        response(data.statusCode, JSON.stringify(data.body));
    }
};
