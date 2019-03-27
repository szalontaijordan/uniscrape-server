import { prop, Typegoose } from 'typegoose';
import { SearchHistory } from '../types/book/all.type';

/**
 * Entity class for search history.
 * 
 * @author Szalontai Jordán
 */
export class SearchHistoryItem extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    searchHistory: SearchHistory;
}

/**
 * Mongoose model for search history.
 * 
 * @see SearchHistoryItem
 */
export const SearchHistoryItemModel = new SearchHistoryItem().getModelForClass(SearchHistoryItem);
