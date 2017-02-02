'use strict';

var uuid = require('uuid');

module.exports = function (options) {
    options = options || {};
    options.uuidVersion = options.uuidVersion || 'v4';
    options.setHeader = options.setHeader === undefined || !!options.setHeader;
    options.headerName = options.headerName || 'X-Request-Id';

    return function (req, res, next) {
        req.id = req.header(options.headerName) || uuid[options.uuidVersion](options, options.buffer, options.offset);
        if (options.setHeader) {
            res.setHeader(options.headerName, req.id);
        }
        next();
    };
};
