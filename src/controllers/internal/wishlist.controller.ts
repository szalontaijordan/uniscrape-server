import * as express from 'express';

import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, Delete, PathParams, Response, UseAfter } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WishlistService } from '../../services/utils/wishlist.service';

import { CommonBookList, CommonBookItem, TrueMessage } from '../../types/book/all.type';
import { Conflict, BadRequest, NotFound } from 'ts-httpexceptions';

@Controller('/internal')
export class WishlistController {

    constructor(private wishlist: WishlistService) {
    }

    @Get('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async getBookItemsOnInternalWishlist(@Locals('userId') userId: string): Promise<CommonBookList> {
        const books = await this.wishlist.getBookItemsOnInternalWishlist(userId);

        return { books };
    }

    @Get('/wishlist/:ISBN')
    @UseBefore(GoogleMiddleware)
    public async getBookItemFromInternalWishlist(
        @Required() @PathParams('ISBN') ISBN: string,
        @Locals('userId') userId: string): Promise<CommonBookItem> {
        try {
            return await this.wishlist.getBookItemFromInternalWishlist(userId, ISBN);
        } catch (e) {
            throw new NotFound(e.message);
        }
    }

    @Post('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async postBookItemToInternalWishlist(
        @Response() res: express.Response,
        @Required() @BodyParams('bookItem') bookItem: CommonBookItem,
        @Locals('userId') userId: string): Promise<CommonBookItem> {
        try {
            res.status(201);
            return await this.wishlist.addBookItemToInternalWishlist(bookItem, userId);
        } catch (e) {
            throw new Conflict(e.message);
        }
    }

    @Delete('/wishlist/:ISBN')
    @UseBefore(GoogleMiddleware)
    public async deleteBookItemFromInternalWishlist(
        @Response() res: express.Response,
        @Required() @PathParams('ISBN') ISBN: string,
        @Locals('userId') userId: string): Promise<TrueMessage> {
        try {
            res.status(204);
            await this.wishlist.deleteBookItemFromInternalWishlist(userId, ISBN);
            return { message: 'true' };
        } catch(e) {
            throw new BadRequest(e.message);
        }
    }
}
