'use strict';

const uuid = require('uuid');

module.exports = function (options) {
    options = options || {};
    options.uuidVersion = options.uuidVersion || 'v4';
    options.setHeader = options.setHeader === undefined || !!options.setHeader;
    options.headerName = options.headerName || 'X-Request-Id';
    options.attributeName = options.attributeName || 'id';
    options.requestIdGenerator = options.requestIdGenerator || uuid[options.uuidVersion].bind(undefined, options, options.buffer, options.offset);

    return function (req, res, next) {
        req[options.attributeName] = req.headers[options.headerName.toLowerCase()] || options.requestIdGenerator();
        if (options.setHeader) {
            res.setHeader(options.headerName, req[options.attributeName]);
        }
        next();
    };
};
