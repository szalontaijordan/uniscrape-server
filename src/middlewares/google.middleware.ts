import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../config/vars';

@Middleware()
export default class GoogleMiddleware implements IMiddleware {

    constructor() {
    }

    async use(@Request() req, @Response() res, @Next() next) {
        return await this.auth(req, res, next);
    }

    private async auth(@Request() req, @Response() res, @Next() next) {
        try {
            const token = req.get('Authorization').split('Bearer ')[1];
        
            const CLIENT_ID = config.google.web.client_id;
            const client = new OAuth2Client(token);
    
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });

            res.locals.userId = ticket.getUserId();
            next();
        } catch (err) {
            res.status(401).send({ message: 'The provided Google Auth Token is invalid.'});
        }
    }
}