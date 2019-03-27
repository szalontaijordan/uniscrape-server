import * as express from 'express';

import { Controller, Locals, Post, UseBefore, Delete, BodyParams, Response, Required, Get, } from '@tsed/common';
import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WatcherService } from '../../services/utils/watcher.service';
import { TrueMessage } from '../../types/book/all.type';
import { NotFound } from 'ts-httpexceptions';

@Controller('/internal')
export class WatcherController {

    constructor(private watcherService: WatcherService) {
    }

    @Get('/watcher/subscription')
    @UseBefore(GoogleMiddleware)
    public async getWatcherSubscription(
        @Locals('userId') userId: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        try {
            await this.watcherService.getSubscription(userId);
            return { message: 'true' };
        } catch (e) {
            throw new NotFound(e.message);
        }
    }

    @Post('/watcher/subscription')
    @UseBefore(GoogleMiddleware)
    public async postWatcherSubscription(
        @Locals('userId') userId: string,
        @Required() @BodyParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.subscribeToWatcher(userId, email);
        res.status(201);
        return { message: 'true' };
    }

    @Delete('/watcher/subscription')
    @UseBefore(GoogleMiddleware)
    public async deleteWatcherSubscription(
        @Locals('userId') userId: string,
        @Required() @BodyParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.unsubscribeFromWatcher(userId, email);
        res.status(204);
        return { message: 'true' };
    }
}
