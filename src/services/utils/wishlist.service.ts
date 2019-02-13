import { Service, OnInit } from '@tsed/common';
import { DatabaseService } from './db.service';

import { CommonBookItem } from '../../types/book/all.type';

@Service()
export class WishlistService implements OnInit {
    
    constructor(private db: DatabaseService) {
    }
    
    public $onInit(): void {
    }

    public async getBookItemsOnInternalWishlist(userId: string): Promise<Array<CommonBookItem>> {
        const internalWishlist = await this.db.getInternalWishlist(userId);

        if (!internalWishlist) {
            await this.db.createWishlist(userId);
            return [];
        }

        return internalWishlist.bookList.books;
    }

    public async addBookItemToInternalWishlist(bookItem: CommonBookItem, userId: string): Promise<CommonBookItem> {
        await this.db.addBookToWishlist(userId, bookItem);
        return bookItem;
    }

    public async deleteBookItemFromInternalWishlist(userId: string, ISBN: string): Promise<void> {
        await this.db.deleteBookItemFromWishlist(userId, ISBN);
    }

    public async getBookItemFromInternalWishlist(userId: string, ISBN: string): Promise<CommonBookItem> {
        return await this.db.getBookItemByISBN(userId, ISBN);
    }
}
