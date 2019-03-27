import * as express from 'express';
import { IMiddlewareError, MiddlewareError, Request, Response, Next, Err } from '@tsed/common';

import { Exception as HttpException, InternalServerError } from 'ts-httpexceptions';

/**
 * Middleware class for handling errors thrown in the application.
 * 
 * Since all the errors that are thrown are either from a controller, middleware or
 * the business logic, this middleware forwards the correct error responses to the client.
 * 
 * @author Szalontai Jordán
 */
@MiddlewareError()
export class ErrorHandlerMiddleware implements IMiddlewareError {

    /**
     * Creates the error response that will be sent to the client, then
     * sends it.
     * 
     * @param error (injected) the error that was thrown
     * @param request (injected) the `express.Request` object
     * @param response (injected) the `express.Response` object
     * @param next (injected) the `express.NextFunction` object
     */
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
