import { prop, Typegoose } from 'typegoose';
import { CommonBookList } from '../types/book/all.type';

/**
 * Entity class for wishlist items.
 * 
 * @author Szalontai Jordán
 */
export class WishlistItem extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    bookList: CommonBookList;
}

/**
 * Mongoose model for wishlist items.
 * 
 * @see WishlistItem
 */
export const WishlistItemModel = new WishlistItem().getModelForClass(WishlistItem);
