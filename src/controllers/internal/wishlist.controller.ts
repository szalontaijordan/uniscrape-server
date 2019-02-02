import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { WishlistService } from '../../services/utils/wishlist.service';

import { DepositoryBookItem, DepositoryBookList } from '../../types/book/depository.type';

@Controller('/internal')
export class WishlistController {

    constructor(private wishlist: WishlistService) {
    }

    @Get('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async getBookItemsOnInternalWishlist(@Locals('userId') userId: string): Promise<DepositoryBookList> {
        const books = await this.wishlist.getBookItemsOnInternalWishlist(userId);

        return { books };
    }

    @Post('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async postBookItemToInternalWishlist(
        @Required() @BodyParams('bookItem') bookItem: DepositoryBookItem,
        @Locals('userId') userId: string): Promise<DepositoryBookItem> {
        return await this.wishlist.addBookItemToInternalWishlist(bookItem, userId);
    }
}
