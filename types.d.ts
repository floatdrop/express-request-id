import express from 'express';
import {Request, RequestHandler} from 'express-serve-static-core';

declare global {
	namespace Express {
		// Inject additional properties on express.Request
		interface Request {
			id: string;
		}
	}
}

declare namespace expressRequestId {
	interface Options {
		setHeader?: boolean | undefined;
		headerName?: string | undefined;
		generator?: ((request: Request) => string) | undefined;
	}
}

declare function expressRequestId(options?: expressRequestId.Options): RequestHandler;
export = expressRequestId;
