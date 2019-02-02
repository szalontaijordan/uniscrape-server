import { Service, OnInit } from '@tsed/common';
import { DatabaseService } from './db.service';

import { DepositoryBookItem } from '../../types/book/depository.type';

@Service()
export class WishlistService implements OnInit {
    
    constructor(private db: DatabaseService) {
    }
    
    public $onInit(): void {
    }

    public async getBookItemsOnInternalWishlist(userId: string): Promise<Array<DepositoryBookItem>> {
        const internalWishlist = await this.db.getInternalWishlist();
        const entities = await internalWishlist.find({ userId }).toArray();
        const books = entities.map((entity: any & { bookItem: DepositoryBookItem }) => entity.bookItem);

        return books;
    }

    public async addBookItemToInternalWishlist(bookItem: DepositoryBookItem, userId: string): Promise<DepositoryBookItem> {
        const internalWishlist = await this.db.getInternalWishlist();
        await internalWishlist.insertOne({ userId, bookItem });

        return bookItem;
    }
}
