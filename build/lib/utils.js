'use strict';

var tools = {
    /**
     * 浅拷贝、合并
     * @param  {Object} target 目标对象
     * @return {Object}        合并之后的对象
     */
    shallowClone: function (target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        if (typeof target !== 'object') {
            target = {};
        }
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source !== undefined && source !== null) {
                for (var name in source) {
                    if (source.hasOwnProperty(name)) {
                        target[name] = source[name];
                    }
                }
            }
        }
        return target;
    }
};

module.exports = tools;
