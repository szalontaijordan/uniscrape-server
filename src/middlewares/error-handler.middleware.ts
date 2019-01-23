import * as express from 'express';
import { IMiddlewareError, MiddlewareError, Request, Response, Next, Err } from '@tsed/common';
import { Exception as HttpException } from 'ts-httpexceptions';

import { get } from 'lodash';

@MiddlewareError()
export class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(@Err() error: any,
        @Request() request: express.Request,
        @Response() response: express.Response,
        @Next() next: express.NextFunction
    ): any {
        if (response.headersSent) {
            return next(error);
        }

        console.log(JSON.stringify(error, null, 2));

        if (error instanceof HttpException) {
            const { status, message } = error;
            const type = get((error as any).exception || error, 'constructor.name');
            const date = new Date();

            response.status(error.status).send({ message, status, type, date });
        } else {
            response.status(500).send({ message: 'Internal error.', status: 500, type: 'InternalServerError', date: new Date() });
        }

        return next();
    }
}
