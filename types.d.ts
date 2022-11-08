import express from 'express';
import type {Request, RequestHandler} from 'express-serve-static-core';

declare global {
	namespace Express {
		// Inject additional properties on express.Request
		// Should be interface to support declaration merging.
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Request {
			id: string;
		}
	}
}

declare namespace expressRequestId {
	type Options = {
		setHeader?: boolean | undefined;
		headerName?: string | undefined;
		generator?: ((request: Request) => string) | undefined;
	};
}

declare function expressRequestId(options?: expressRequestId.Options): RequestHandler;
export = expressRequestId;
