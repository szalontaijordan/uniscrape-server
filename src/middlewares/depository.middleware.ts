import * as express from 'express';
import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { Forbidden } from 'ts-httpexceptions';
import { DepositoryHeadlessService } from '../services/depository/depository.headless.service';

/**
 * Middleware class for deciding wheter the user is logged in or not
 * to Book Depository.
 * 
 * @author Szalontai Jordán
 */
@Middleware()
export class DepositoryMiddleware implements IMiddleware {

    constructor(private depoHeadless: DepositoryHeadlessService) {
    }

    /**
     * Continues with the next request, if the `userId` is defined in `res.locals` and
     * with that Google User Id a user is logged in to BookDepository.
     * 
     * @param req (injected) the `express.Request` object
     * @param res (injected) the `express.Response` object
     * @param next (injected) the `express.NextFunction` object
     * 
     * @throws `Forbidden` if `res.locals.userId` doesn't lead to an existing login
     */
    public async use(
        @Request() req: express.Request,
        @Response() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        try {
            const isLoggedIn = await this.depoHeadless.isLoggedIn(res.locals.userId);
            next();
        } catch (e) {
            throw new Forbidden(e.mesasge);
        }
    }
}
