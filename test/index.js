/* global describe, it */

'use strict';

var request = require('supertest');
var should = require('should');
var requestId = require('..');

function noop (req, res, next) {
    next();
}

describe('express-request-id', function () {
    it('should set request id', function (done) {
        var app = require('express')();
        app.use(requestId());
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('id').with.lengthOf(36);
            next();
        });

        request(app).get('/').end(done);
    });

    it('should use the `X-Request-Id` header value in case it was provided', function (done) {
        var app = require('express')();
        app.use(requestId());
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('id').equal('ARTIFICIAL-ID');
            next();
        });

        request(app).get('/').set('X-Request-Id', 'ARTIFICIAL-ID').end(done);
    });

    it('should set header by default', function (done) {
        var app = require('express')();
        app.use(requestId());
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should omit header with option setHeader=false', function (done) {
        var app = require('express')();
        app.use(requestId({ setHeader: false }));
        app.get('/', noop);

        request(app)
            .get('/')
            .end(function(err, res) {
                if (err) { return done(err); }
                res.headers.should.not.have.property('X-Request-Id');
                done();
            });
    });

    it('should omit header with option setHeader=0', function (done) {
        var app = require('express')();
        app.use(requestId({ setHeader: 0 }));
        app.get('/', noop);

        request(app)
            .get('/')
            .end(function(err, res) {
                if (err) { return done(err); }
                res.headers.should.not.have.property('X-Request-Id');
                done();
            });
    });

    it('should use the `X-Custom-Id` header name with option headerName=X-Custom-Id', function (done) {
        var app = require('express')();
        app.use(requestId({ headerName: 'X-Custom-Id' }));
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Custom-Id', /\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should use uuid v4 by default', function (done) {
        var app = require('express')();
        app.use(requestId());
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should use uuid v1 with option uuidVersion=`v1`', function (done) {
        var app = require('express')();
        app.use(requestId({ uuidVersion: 'v1' }));
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-1\w{3}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should pass options to node-uuid', function (done) {
        var app = require('express')();
        app.use(requestId({ uuidVersion: 'v1', msecs: new Date('10-05-1990'), nsecs: 0, clockseq: 0, node: [0,0,0,0,0,0] }));
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /00000000-0000-1000-8000-000000000000/)
            .end(done);
    });
    
    it('should set use the specified attribute name for the identifier', function (done) {
        var app = require('express')();
        app.use(requestId({ attributeName: 'specificId' }));
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('specificId').with.lengthOf(36);
            req.should.not.have.property('id');
            next();
        });

        request(app).get('/').end(done);
    });

    it('should add a specified prefix to the request id', function (done) {
        var app = require('express')();
        app.use(requestId({ prefix : 'myapp-' }));
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('id').startWith('myapp-');
            req.should.have.property('id').with.lengthOf(42);
            next();
        });

        request(app).get('/').end(done);
    });

    it('should not add prefix when the `X-Request-Id` header value was provided', function (done) {
        var app = require('express')();
        app.use(requestId({ prefix : 'myapp-' }));
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('id').equal('ARTIFICIAL-ID');
            next();
        });

        request(app).get('/').set('X-Request-Id', 'ARTIFICIAL-ID').end(done);
    });
});
