import test from 'ava';
import express from 'express';
import request from 'supertest';
import {validate} from 'uuid';
import requestID from './index.js';

function errorHandler(t) {
	return (error, _request, _response, next) => {
		t.fail(error.message);
		next();
	};
}

test('sets request id', async t => {
	const app = express();
	app.use(requestID());
	app.get('/', (request, response, _next) => {
		t.true(validate(request.id));
		response.send('OK');
	});
	app.use(errorHandler(t));

	const response = await request(app).get('/').expect(200, 'OK');

	t.true(validate(response.get('X-Request-Id')));
});

test('preserves old request id', async t => {
	const app = express();
	app.use(requestID());
	app.get('/', (request, response, _next) => {
		t.is(request.id, 'MyID');
		response.send('OK');
	});
	app.use(errorHandler(t));

	await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');
});

test('setHeader option', async t => {
	const app = express();
	app.use(requestID({setHeader: false}));
	app.get('/', (_request, response, _next) => {
		response.send('OK');
	});
	app.use(errorHandler(t));

	const response = await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');

	t.is(response.get('X-Request-Id'), undefined);
});

test('headerName option', async t => {
	const app = express();
	app.use(requestID({headerName: 'X-My-Request-Id'}));
	app.get('/', (_request, response, _next) => {
		response.send('OK');
	});
	app.use(errorHandler(t));

	const response = await request(app).get('/').set('X-My-Request-Id', 'MyID').expect(200, 'OK');

	t.is(response.get('X-My-Request-Id'), 'MyID');
});

test('generator option', async t => {
	const app = express();
	app.use(requestID({generator: _request => 'ID'}));
	app.get('/', (request, response, _next) => {
		t.is(request.id, 'ID');
		response.send('OK');
	});
	app.use(errorHandler(t));

	await request(app).get('/').expect(200, 'OK');
});
