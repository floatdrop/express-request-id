import express from 'express';

declare global {
	namespace Express {
		// Inject additional properties on express.Request
		interface Request {
			id: string;
		}
	}
}
