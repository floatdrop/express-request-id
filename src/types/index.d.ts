import type { Request } from 'express-serve-static-core';

export { }

declare global {
  namespace Express {
    export interface Request {
      id: string;
    }
  }
}

export type Options = {
  generator?: ((_request: Request) => string);
  headerName?: string;
  setHeader?: boolean;
  attrName?: string;
}
