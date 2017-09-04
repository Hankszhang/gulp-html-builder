'use strict';

var path = require('path');
var url = require('url');
var fs = require('fs');

module.exports = function (req, res, next) {
    function response(code, body) {
        try {
            res.status(code).set({
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': 'application/json'
            });
            res.end(body);
            next();
        }
        catch (e) {
            // eslint-disable-next-line
            console.log(e);
            return;
        }
    }

    var pathname = url.parse(req.url).pathname;
    var filePath = path.normalize('../dev/mock/' + pathname);

    // 不是api开头的请求，直接next
    if (pathname.match(/^\/api/)) {
        next();
        return;
    }

    try {
        var resolvedPath = path.resolve(__dirname, filePath);

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
        // eslint-disable-next-line
        console.log(e);
        data = {
            statusCode: 500,
            msg: '缺少mock数据',
            body: ''
        };
        response(data.statusCode, data.body);
    }
};
