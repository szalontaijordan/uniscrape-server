import { prop, Typegoose } from 'typegoose';
import { CommonBookList } from '../types/book/all.type';

export class WishlistItem extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    bookList: CommonBookList;
}

export const WishlistItemModel = new WishlistItem().getModelForClass(WishlistItem);
