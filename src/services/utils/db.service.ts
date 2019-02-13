import * as mongoose from 'mongoose';
import { Service, OnInit } from '@tsed/common';

import { config } from '../../../config/vars';
import { WishlistItemModel, WishlistItem } from '../../models/wishlist-item';
import { InstanceType } from 'typegoose';
import { CommonBookItem } from '../../types/book/all.type';
import { BookItemAlreadyOnWishlistException, BookItemIsNotOnWishlistException } from '../../types/exceptions/book.exceptions';
import { BOOK_ITEM_ALREADY_ON_WISHLIST_MESSAGE, BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE } from '../../types/exceptions/exceptions';

@Service()
export class DatabaseService implements OnInit {
    
    private db: mongoose.Connection;
    
    constructor() {
    }
    
    public $onInit(): void {
        mongoose.connect(config.db.testURI);

        this.db = mongoose.connection;
        this.db.on('error', err => {
            throw err;
        });
        this.db.once('open', () => console.log('MongoDB connected to test URI'));
    }

    public async getInternalWishlist(userId: string): Promise<InstanceType<WishlistItem>> {
        return await WishlistItemModel.findOne({ userId });
    }

    public async createWishlist(userId: string): Promise<void> {
        const wishlist = new WishlistItemModel({ userId, bookList: { books: [] } });
        await wishlist.save();
    }

    public async addBookToWishlist(userId: string, bookItem: CommonBookItem): Promise<void> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(bookItem.ISBN) >= 0;

        if (!isBookAlreadyOnWishlist) {
            wishlist.bookList = { books: [ ...wishlist.bookList.books, bookItem ] };
            await wishlist.save();
            return;
        }

        throw new BookItemAlreadyOnWishlistException(BOOK_ITEM_ALREADY_ON_WISHLIST_MESSAGE);
    }

    public async deleteBookItemFromWishlist(userId: string, ISBN: string): Promise<void> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(ISBN) >= 0;

        if (isBookAlreadyOnWishlist) {
            wishlist.bookList = { books: wishlist.bookList.books.filter(book => book.ISBN !== ISBN) };
            await wishlist.save();
            return;
        }

        throw new BookItemIsNotOnWishlistException(BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE);
    }

    public async getBookItemByISBN(userId: string, ISBN: string): Promise<CommonBookItem> {
        const wishlist = await this.getInternalWishlist(userId);
        const isBookAlreadyOnWishlist = wishlist.bookList.books.map(book => book.ISBN).indexOf(ISBN) >= 0;

        if (isBookAlreadyOnWishlist) {
            return wishlist.bookList.books.find(book => book.ISBN === ISBN);
        }

        throw new BookItemIsNotOnWishlistException(BOOK_ITEM_IS_NOT_ON_WISHLIST_MESSAGE);
    }

    public async getSearchStatistics(): Promise<any> {
        // return this.client.db('uniscrape_test').collection('search-statistics');
        return [];
    }
}