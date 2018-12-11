import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, PathParams,  } from '@tsed/common';

import { mockBookItem, BookItem } from '../models/book-item.model';

import { DatabaseService } from '../services/db.service';
import { DOMService } from '../services/dom.service';

import GoogleMiddleware from '../middlewares/google.middleware';

@Controller('/book')
export class BookController {

    constructor(private db: DatabaseService, private dom: DOMService) {
    }

    @Get('/sections')
    async getSections() {
        const sections = await this.dom.getDepositoryHomeSections();
        return { sections };
    }

    @Get('/section/:sectionName')
    async getBookItemsOfSection(@PathParams('sectionName') sectionName: string) {
        const books = await this.dom.getDepositoryHomeBooksBySection(sectionName);
        return { books };
    }

    @Get('/search/depository/:searchTerm')
    @UseBefore(GoogleMiddleware)
    async getDepositorySearchResults(@PathParams('searchTerm') searchTerm: string, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);
        // TODO: provide real implementation

        return { books: [mockBookItem] };
    }

    @Get('/search/ebay/:searchTerm')
    @UseBefore(GoogleMiddleware)
    async getEbaySearchResults(@PathParams('searchTerm') searchTerm: string, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);
        // TODO: provide real implementation

        return { books: [mockBookItem] };
    }

    @Get('/search/amazon/:searchTerm')
    @UseBefore(GoogleMiddleware)
    async getAmazonSearchResults(@PathParams('searchTerm') searchTerm: string, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);
        // TODO: provide real implementation

        return { books: [mockBookItem] };
    }

    @Get('/search/recent')
    @UseBefore(GoogleMiddleware)
    async getRecentSearches(@Locals('userId') userId) {
        const stats = await this.db.getSearchStatistics();
        const currentStats = await stats.find({ userId }).toArray();
        const recentSearches = currentStats[0].searchArray;

        return { recentSearches };
    }

    @Get('/wishlist/internal')
    @UseBefore(GoogleMiddleware)
    async getBookItemsOnInternalWishlist(@Locals('userId') userId: string) {
        const internalWishlist = await this.db.getInternalWishlist();
        const entities = await internalWishlist.find({ userId }).toArray();
        const books = entities.map(entity => entity.bookItem);

        return { books };
    }

    @Post('/wishlist/internal')
    @UseBefore(GoogleMiddleware)
    async postBookItemToInternalWishlist(@Required() @BodyParams('bookItem') bookItem: BookItem, @Locals('userId') userId: string) {
        const internalWishlist = await this.db.getInternalWishlist();

        await internalWishlist.insertOne({
            userId,
            bookItem
        });

        return bookItem;
    }

    private async sendSearchStatistics(searchTerm: string, userId: string) {
        const stats = await this.db.getSearchStatistics();
        const currentStats = await stats.find({ userId }).toArray();
        const existingArray = currentStats[0].searchArray;

        const newArray = Array
            .from(new Set([decodeURIComponent(searchTerm), ...existingArray]))
            .slice(0, 15);

        await stats.updateOne({ userId }, { $set: { searchArray: newArray } });
    }
}
