/* global describe, it */

'use strict';

var request = require('supertest');
var should = require('should');

function noop (req, res, next) {
    next();
}

describe('express-request-id', function () {
    it('should set request id', function (done) {
        var app = require('express')();
        app.use(require('..')());
        app.get('/', function (req, res, next) {
            should.exist(req);
            req.should.have.property('id').with.lengthOf(36);
            next();
        });

        request(app).get('/').end(done);
    });

    it('should set header by default', function (done) {
        var app = require('express')();
        app.use(require('..')());
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should omit header with option setHeader=false', function (done) {
        var app = require('express')();
        app.use(require('..')({ setHeader: false }));
        app.get('/', noop);

        request(app)
            .get('/')
            .end(function(err, res) {
                if (err) { return done(err); }
                res.headers.should.not.have.property('X-Request-Id');
                done();
            });
    });

    it('should use uuid v4 by default', function (done) {
        var app = require('express')();
        app.use(require('..')());
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should use uuid v1 with option uuidVersion=`v1`', function (done) {
        var app = require('express')();
        app.use(require('..')({ uuidVersion: 'v1' }));
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /\w{8}-\w{4}-1\w{3}-\w{4}-\w{12}/)
            .end(done);
    });

    it('should pass options to node-uuid', function (done) {
        var app = require('express')();
        app.use(require('..')({ uuidVersion: 'v1', msecs: new Date('10-05-1990'), nsecs: 0, clockseq: 0, node: [0,0,0,0,0,0] }));
        app.get('/', noop);

        request(app)
            .get('/')
            .expect('X-Request-Id', /00000000-0000-1000-8000-000000000000/)
            .end(done);
    });
});
