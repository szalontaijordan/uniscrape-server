import * as express from 'express';
import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { BadRequest, InternalServerError, Forbidden } from 'ts-httpexceptions';

import {
    GoogleIdTokenInvalidException,
    GoogleIdTokenMissingException
} from '../types/exceptions/google.exceptions';

import { GoogleService } from '../services/utils/google.service';

/**
 * Middleware class for resolving Google User Ids from the Google Id token
 * sent in the headers.
 * 
 * @author Szalontai Jordán
 */
@Middleware()
export class GoogleMiddleware implements IMiddleware {

    constructor(private googleService: GoogleService) {
    }

    /**
     * Continues with the next request, if the `userId` can be resolved by `GoogleService`
     * from the token in the headers.
     * 
     * The headers must contain
     * ```
     * ...
     * 'Authorization': 'Bearer <google user id token>'
     * ...
     * ```
     * 
     * Then the service validates the token, and sets `res.locals.userId` to the Google User Id.
     * 
     * @param req (injected) the `express.Request` object
     * @param res (injected) the `express.Response` object
     * @param next (injected) the `express.NextFunction` object
     * 
     * @throws `BadRequest` if the token in the headers is missing
     * @throws `Forbidden` if the token in the headers is invalid
     * @throws `InernalServerError` if some unexpected errors happen during the validation of the token
     * 
     * @see GoogleService
     */
    public async use(
        @Request() req: express.Request,
        @Response() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {
        const authHeader = req.get('Authorization');

        try {
            const userId = await this.googleService.validateGoogleIdToken(authHeader);
            res.locals.userId = userId;
            next();
        } catch (e) {
            if (e instanceof GoogleIdTokenMissingException) {
                throw new BadRequest(e.message);                
            }
            if (e instanceof GoogleIdTokenInvalidException) {
                throw new Forbidden(e.message);
            }
            throw new InternalServerError(e.mesasge);
        }
    }
}
