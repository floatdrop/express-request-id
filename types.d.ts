import "express"

declare module "express-request-id" {
  interface Request {
    id: string;
  }
}
