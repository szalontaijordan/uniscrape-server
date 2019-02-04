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
        const internalWishlist = await this.db.getInternalWishlist();
        const entities = await internalWishlist.find({ userId }).toArray();
        const books = entities.map((entity: any & { bookItem: CommonBookItem }) => entity.bookItem);

        return books;
    }

    public async addBookItemToInternalWishlist(bookItem: CommonBookItem, userId: string): Promise<CommonBookItem> {
        const internalWishlist = await this.db.getInternalWishlist();
        await internalWishlist.insertOne({ userId, bookItem });

        return bookItem;
    }
}
