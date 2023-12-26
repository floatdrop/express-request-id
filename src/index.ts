import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Options } from 'types';
import { v4 as uuidv4 } from 'uuid';

const generateV4UUID = (_request: Request) => uuidv4();
const ATTRIBUTE_NAME = 'id';
const HEADER_NAME = 'X-Request-Id';

function requestId(options: Options = { }): any {
  return (request: Request, response: Response, next: NextFunction): any => {
    const {generator = generateV4UUID, headerName = HEADER_NAME, setHeader = true} = options;
    const existingId: string | undefined = request.get(headerName);
    const id: string = existingId === undefined ? generator(request) : existingId;

    if (setHeader) {
      response.set(headerName, id);
    }

    request[ATTRIBUTE_NAME] = id;

    // execute next function in the chain
    next();
  };
}

export default requestId;
