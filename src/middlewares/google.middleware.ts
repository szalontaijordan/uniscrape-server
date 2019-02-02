import * as express from 'express';
import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { OAuth2Client } from 'google-auth-library';

import { config } from '../../config/vars';

import {
    GoogleAuthErrorResponse,
    GoogleCommonErrorResponse
} from '../types/error-responses/google.error-response';

import {
    GoogleIdTokenInvalidException,
    GoogleTokenMissingException
} from '../types/exceptions/google.exceptions';

@Middleware()
export class GoogleMiddleware implements IMiddleware {

    constructor() {
    }

    public async use(
        @Request() req: express.Request,
        @Response() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {
        const authHeader = req.get('Authorization');

        if (!authHeader || authHeader.indexOf('Bearer') !== 0) {
            throw new GoogleCommonErrorResponse(new GoogleTokenMissingException('You must provide a valid Google ID token'));
        }

        try {
            const token = authHeader.split('Bearer ')[1];
        
            const CLIENT_ID = config.google.web.client_id;
            const client = new OAuth2Client(token);
    
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });

            res.locals.userId = ticket.getUserId();
            next();
        } catch (err) {
            throw new GoogleAuthErrorResponse(new GoogleIdTokenInvalidException('The provided Google ID Token is invalid.'));
        }
    }
}
