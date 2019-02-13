import * as express from 'express';
import { IMiddlewareError, MiddlewareError, Request, Response, Next, Err } from '@tsed/common';

import { Exception as HttpException, InternalServerError } from 'ts-httpexceptions';

@MiddlewareError()
export class ErrorHandlerMiddleware implements IMiddlewareError {

    public use(@Err() error: HttpException | any,
        @Request() request: express.Request,
        @Response() response: express.Response,
        @Next() next: express.NextFunction): void {
        if (response.headersSent) {
            return next(error);
        }

        const errorResponse = { ...error, message: error.message };
        console.log(JSON.stringify(errorResponse, null, 2));

        if (error instanceof HttpException) {
            response.status(error.status).send(errorResponse);
        } else {
            response.status(500).send(new InternalServerError('Internal error'));
        }

        return next();
    }
}
