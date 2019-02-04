import * as express from 'express';
import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { Unauthorized, BadRequest, InternalServerError } from 'ts-httpexceptions';

import {
    GoogleIdTokenInvalidException,
    GoogleIdTokenMissingException
} from '../types/exceptions/google.exceptions';

import { GoogleService } from '../services/utils/google.service';

@Middleware()
export class GoogleMiddleware implements IMiddleware {

    constructor(private googleService: GoogleService) {
    }

    public async use(
        @Request() req: express.Request,
        @Response() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {
        const authHeader = req.get('Authorization');

        try {
            const userId = this.googleService.validateGoogleIdToken(authHeader);
            res.locals.userId = userId;
            next();
        } catch (e) {
            if (e instanceof GoogleIdTokenMissingException) {
                throw new BadRequest(e.message);                
            }
            if (e instanceof GoogleIdTokenInvalidException) {
                throw new Unauthorized(e.message);
            }
            throw new InternalServerError(e.mesasge);
        }
    }
}
