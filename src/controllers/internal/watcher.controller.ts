import * as express from 'express';

import { Controller, Locals, Post, UseBefore, Delete, BodyParams, Response, Required, Get, PathParams, } from '@tsed/common';
import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WatcherService } from '../../services/utils/watcher.service';
import { TrueMessage } from '../../types/book/all.type';
import { NotFound } from 'ts-httpexceptions';

/**
 * Controller class for the `/internal/watcher` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/internal/watcher')
export class WatcherController {

    constructor(private watcherService: WatcherService) {
    }

    /**
     * Returns a simple message if the user with the resolved Google User Id has subscription to
     * the watcher.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * @param res (injected) the `express.Response` object
     * 
     * @throws `NotFound` if there is no subscription for the user with the resolved Google User Id
     * @see Watcher
     */
    @Get('/subscription')
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

    /**
     * Creates a subscription entry with the resolved Google User Id and the given email.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * @param email the email of the user that will be used to send update emails
     * @param res (injected) the `express.Response` object
     */
    @Post('/subscription')
    @UseBefore(GoogleMiddleware)
    public async postWatcherSubscription(
        @Locals('userId') userId: string,
        @Required() @BodyParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.subscribeToWatcher(userId, email);
        res.status(201);
        return { message: 'true' };
    }

    /**
     * Deletes a subscription entry based on the resolved Google User Id and the given email.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * @param email the email of the user that will be used to send update emails
     * @param res (injected) the `express.Response` object
     */
    @Delete('/subscription/:email')
    @UseBefore(GoogleMiddleware)
    public async deleteWatcherSubscription(
        @Locals('userId') userId: string,
        @Required() @PathParams('email') email: string,
        @Response() res: express.Response): Promise<TrueMessage> {
        await this.watcherService.unsubscribeFromWatcher(userId, email);
        res.status(204);
        return { message: 'true' };
    }
}
