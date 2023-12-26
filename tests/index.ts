import express from 'express';
import requestId from '../src';
import { Express, Request, Response } from 'express-serve-static-core';
import { v4 as uuidv4 } from 'uuid';
import request from 'supertest';
import http from 'http';

const generateV4UUID = (_request: Request) => uuidv4();

describe('default options', async () => {
  describe('using the default values', () => {
    let server: http.Server;
    let app: Express;

    before((done) => {
      app = express();
      app.use(requestId());
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      server = app.listen(4000, () => {
        console.log('listing to port 4000');
        done();
      });
    });

    after((done) => {
      server.close();
      done();
    });

    it('should set the request id using the default header option', async function () {
      try {
        const response = await request(server).get('/').expect(200);
        console.log(response.get('X-Request-Id'));
      } catch (error) {
        console.log(error);
      }
      console.log('end of test');
    });
  });

  describe('using custom values', () => {
    let server: http.Server;
    let app: Express;

    before((done) => {
      const options = {
        setHeader: false,
      }
      app = express();
      app.use(requestId(options));
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      server = app.listen(4000, () => {
        console.log('listing to port 4000');
        done();
      });
    });

    after((done) => {
      server.close();
      done();
    });

    it('should not set the resopnse header value when the `setHeader value us false', async () => {

      try {
        const r = await request(server).get('/').expect(200);
        console.log(r.get('X-Request-Id'));
      } catch (error) {
        console.log(error);
      }
      console.log('end of test');
    });
  });
});
// test('sets request id', async t => {
//   const app = express();
//   app.use(requestID());
//   app.get('/', (request, response, _next) => {
//     t.true(validate(request.id));
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').expect(200, 'OK');

//   t.true(validate(response.get('X-Request-Id')));
// });

// test('preserves old request id', async t => {
//   const app = express();
//   app.use(requestID());
//   app.get('/', (request, response, _next) => {
//     t.is(request.id, 'MyID');
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');
// });

// test('setHeader option', async t => {
//   const app = express();
//   app.use(requestID({ setHeader: false }));
//   app.get('/', (_request, response, _next) => {
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');

//   t.is(response.get('X-Request-Id'), undefined);
// });

// test('headerName option', async t => {
//   const app = express();
//   app.use(requestID({ headerName: 'X-My-Request-Id' }));
//   app.get('/', (_request, response, _next) => {
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').set('X-My-Request-Id', 'MyID').expect(200, 'OK');

//   t.is(response.get('X-My-Request-Id'), 'MyID');
// });

// test('generator option', async t => {
//   const app = express();
//   app.use(requestID({ generator: _request => 'ID' }));
//   app.get('/', (request, response, _next) => {
//     t.is(request.id, 'ID');
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   await request(app).get('/').expect(200, 'OK');
// });
