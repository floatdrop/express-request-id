import 'express'

declare module 'express' {
  interface Request {
    id: string;
  }
}
