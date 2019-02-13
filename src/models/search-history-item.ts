import { prop, Typegoose } from 'typegoose';
import { SearchHistory } from '../types/book/all.type';

export class SearchHistoryItem extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    searchHistory: SearchHistory;
}

export const SearchHistoryItemModel = new SearchHistoryItem().getModelForClass(SearchHistoryItem);
