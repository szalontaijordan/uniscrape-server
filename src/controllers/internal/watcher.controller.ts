import * as express from 'express';

import { Controller, Locals, Post, UseBefore, Delete, BodyParams, Response, Required, } from '@tsed/common';
import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WatcherService } from '../../services/utils/watcher.service';
import { TrueMessage } from '../../types/book/all.type';

@Controller('/internal')
export class WatcherController {

    constructor(private watcherService: WatcherService) {
    }

    @Post('/watcher/subscribe')
    @UseBefore(GoogleMiddleware)
    public async postSubscribeToWatcher(
        @Locals('userId') userId: string,
        @Required() @BodyParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.subscribeToWatcher(userId, email);
        res.status(201);
        return { message: 'true' };
    }

    @Delete('/watcher/unsubscribe')
    @UseBefore(GoogleMiddleware)
    public async postUnsubscribeFromWatcher(
        @Locals('userId') userId: string,
        @Required() @BodyParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.unsubscribeFromWatcher(userId, email);
        res.status(204);
        return { message: 'true' };
    }
}
