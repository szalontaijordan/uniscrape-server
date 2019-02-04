import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WishlistService } from '../../services/utils/wishlist.service';

import { CommonBookList, CommonBookItem } from '../../types/book/all.type';

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
        return await this.wishlist.addBookItemToInternalWishlist(bookItem, userId);
    }
}
