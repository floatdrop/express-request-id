# express-request-id

[![Tests](https://github.com/floatdrop/express-request-id/workflows/CI/badge.svg)](https://github.com/floatdrop/express-request-id/actions)
[![npm version](https://img.shields.io/npm/v/express-request-id.svg)](https://npmjs.org/package/express-request-id 'View this project on NPM')
[![npm downloads](https://img.shields.io/npm/dm/express-request-id)](https://www.npmjs.com/package/express-request-id)

> Generates UUID for request and add it to header.

## Install

```sh
npm install express-request-id
```

## Usage

```js
import express from 'express';
import requestID from 'express-request-id';

app.use(requestID());

app.get('/', function (req, res, next) {
    res.send(req.id);
    next();
});

app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// curl localhost:3000
// d7c32387-3feb-452b-8df1-2d8338b3ea22
```

## API

### requestID(options?)

#### options

Type: `object`

##### generator

Type: `function`
Default: `func(req) { return uuidv4(); }`

Defines function, that generated ID from request. By default used `uuid` module, that generated UUID V4 for every request. 

##### headerName

Type: `string`
Default: `X-Request-Id`

Defines name of header, that should be used for request ID checking and setting.

##### setHeader

Type: `bool`
Default: `true`

If `false` – header will not be set.
