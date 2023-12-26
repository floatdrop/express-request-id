import type { Request } from 'express-serve-static-core';

export { }

export type Options = {
  generator?: ((_request: Request) => string);
  headerName?: string;
  setHeader?: boolean;
}
