import { Injectable, Logger, NestMiddleware, RequestMethod } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RouteInfo } from '@nestjs/common/interfaces';
import { request } from 'http';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Gets the request log
    Logger.log(`req: ${JSON.stringify({
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
      params: req.params,
      query: req.query
    })}`);
    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }
}
