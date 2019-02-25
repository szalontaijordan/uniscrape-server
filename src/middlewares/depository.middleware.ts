import * as express from 'express';
import { Middleware, IMiddleware, Request, Response, Next } from '@tsed/common';
import { Forbidden } from 'ts-httpexceptions';
import { DepositoryHeadlessService } from '../services/depository/depository.headless.service';

@Middleware()
export class DepositoryMiddleware implements IMiddleware {

    constructor(private depoHeadless: DepositoryHeadlessService) {
    }

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
