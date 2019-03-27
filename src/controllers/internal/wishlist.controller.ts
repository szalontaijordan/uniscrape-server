import * as express from 'express';

import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, Delete, PathParams, Response, UseAfter } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WishlistService } from '../../services/utils/wishlist.service';

import { CommonBookList, CommonBookItem, TrueMessage } from '../../types/book/all.type';
import { Conflict, BadRequest, NotFound } from 'ts-httpexceptions';

/**
 * Controller class for the `/internal/wishlist` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/internal/wishlist')
export class WishlistController {

    constructor(private wishlist: WishlistService) {
    }

    /**
     * Returns a list of books from the internal wishlist of the user with the resolved Google User Id.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     */
    @Get('/')
    @UseBefore(GoogleMiddleware)
    public async getBookItemsOnInternalWishlist(@Locals('userId') userId: string): Promise<CommonBookList> {
        const books = await this.wishlist.getBookItemsOnInternalWishlist(userId);

        return { books };
    }

    /**
     * Returns a single book from the internal wishlist of the user with the resolved Google User Id
     * based on its ISBN number.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `NotFound` if the book is not there with the given ISBN number
     */
    @Get('/:ISBN')
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

    /**
     * Adds a single book to the internal wishlist of the user with the resolved Google User Id.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `Conflict` if the book is already there with the given ISBN number
     */
    @Post('/')
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

    /**
     * Deletes a single book to the internal wishlist of the user with the resolved Google User Id
     * based on its ISBN.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `BadRequest` if the book is not on the wishlist with the given ISBN number
     */
    @Delete('/:ISBN')
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
