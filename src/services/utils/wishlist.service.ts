import { Service, OnInit } from '@tsed/common';
import { InstanceType } from 'typegoose';

import { CommonBookItem } from '../../types/book/all.type';
import { BookItemIsNotOnWishlistException, BookItemAlreadyOnWishlistException } from '../../types/exceptions/book.exceptions';
import { BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE, BOOK_ITEM_ALREADY_ON_WISHLIST_MESSAGE } from '../../types/exceptions/exceptions';

import { WishlistItemModel, WishlistItem } from '../../models/wishlist-item';

@Service()
export class WishlistService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
    }

    public async getBookItemsOnInternalWishlist(userId: string): Promise<Array<CommonBookItem>> {
        const internalWishlist = await this.getInternalWishlist(userId);

        if (!internalWishlist) {
            const wishlist = new WishlistItemModel({ userId, bookList: { books: [] } });
            await wishlist.save();
            return [];
        }

        return internalWishlist.bookList.books;
    }

    public async addBookItemToInternalWishlist(bookItem: CommonBookItem, userId: string): Promise<CommonBookItem> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(bookItem.ISBN) >= 0;

        if (!isBookAlreadyOnWishlist) {
            wishlist.bookList = { books: [ ...wishlist.bookList.books, bookItem ] };
            await wishlist.save();
            return bookItem;
        }

        throw new BookItemAlreadyOnWishlistException(BOOK_ITEM_ALREADY_ON_WISHLIST_MESSAGE);
    }

    public async deleteBookItemFromInternalWishlist(userId: string, ISBN: string): Promise<void> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(ISBN) >= 0;

        if (isBookAlreadyOnWishlist) {
            wishlist.bookList = { books: wishlist.bookList.books.filter(book => book.ISBN !== ISBN) };
            await wishlist.save();
            return;
        }

        throw new BookItemIsNotOnWishlistException(BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE);
    }

    public async getBookItemFromInternalWishlist(userId: string, ISBN: string): Promise<CommonBookItem> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(ISBN) >= 0;

        if (isBookAlreadyOnWishlist) {
            return wishlist.bookList.books.find(book => book.ISBN === ISBN);
        }

        throw new BookItemIsNotOnWishlistException(BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE);
    }

    private async getInternalWishlist(userId: string): Promise<InstanceType<WishlistItem>> {
        const model = await WishlistItemModel.findOne({ userId });
        return model;
    }
}
