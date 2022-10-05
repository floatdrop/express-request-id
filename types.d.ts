import express from 'express';
import type {Request, RequestHandler} from 'express-serve-static-core';

declare global {
	namespace Express {
		// Inject additional properties on express.Request
		type Request = {
			id: string;
		};
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
