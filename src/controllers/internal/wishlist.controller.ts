import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, Delete, PathParams } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WishlistService } from '../../services/utils/wishlist.service';

import { CommonBookList, CommonBookItem } from '../../types/book/all.type';
import { Conflict, BadRequest } from 'ts-httpexceptions';

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

    @Post('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async postBookItemToInternalWishlist(
        @Required() @BodyParams('bookItem') bookItem: CommonBookItem,
        @Locals('userId') userId: string): Promise<CommonBookItem> {
        try {
            return await this.wishlist.addBookItemToInternalWishlist(bookItem, userId);
        } catch (e) {
            throw new Conflict(e.message);
        }
    }

    @Delete('/wishlist/:ISBN')
    @UseBefore(GoogleMiddleware)
    public async deleteBookItemFromInternalWishlist(
        @Required() @PathParams('ISBN') ISBN: string,
        @Locals('userId') userId: string): Promise<void> {
        try {
            await this.wishlist.deleteBookItemFromInternalWishlist(userId, ISBN);
            return;
        } catch(e) {
            throw new BadRequest(e.message);
        }
    }
}
