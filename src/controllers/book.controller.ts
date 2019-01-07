import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, PathParams, Response } from '@tsed/common';

import { DepositoryBookItem } from '../models/depository-book-item.model';

import { AmazonHeadlessService } from '../services/amazon/amazon.headless.service';
import { DatabaseService } from '../services/db/db.service';
import { DepositoryDOMService } from '../services/depository/depository.dom.service';
import { DepositoryHeadlessService } from '../services/depository/depository.headless.service';
import { EbayApiService } from '../services/ebay/ebay.api.service';

import GoogleMiddleware from '../middlewares/google.middleware';

@Controller('/book')
export class BookController {

    constructor(private db: DatabaseService,
                private depoDom: DepositoryDOMService,
                private depoHeadless: DepositoryHeadlessService,
                private ebayApi: EbayApiService,
                private amazonHeadless: AmazonHeadlessService) {
    }

    @Get('/depository/sections')
    async getSections() {
        const sections = await this.depoDom.getDepositoryHomeSections();
        
        return { sections };
    }

    @Get('/depository/section/:sectionName')
    async getBookItemsOfSection(@PathParams('sectionName') sectionName: string) {
        const books = await this.depoDom.getDepositoryHomeBooksBySection(sectionName);
        
        return { books };
    }

    @Get('/depository/search/:searchTerm')
    @Get('/depository/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    async getDepositorySearchResults(@PathParams('searchTerm') searchTerm: string, @PathParams('page') page: number = 1, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);
        
        const books = await this.depoDom.getDepositorySearch(searchTerm, page);
        
        return { books };
    }

    @Post('/depository/auth/login')
    @UseBefore(GoogleMiddleware)
    async postLoginToDepository(@Required() @BodyParams('email') email: string, @Required() @BodyParams('password') password: string, @Locals('userId') userId: string, @Response() res) {
        try {
            const success = await this.depoHeadless.login(email, password, userId);
            return { auth: success };
        } catch (e) {
            res.status(403);
            return { auth: e.message };
        }
    }

    @Post('/depository/auth/logout')
    @UseBefore(GoogleMiddleware)
    async postLogoutFromDepository(@Locals('userId') userId: string, @Response() res) {
        try {
            const success = await this.depoHeadless.logout(userId);
            return { auth: success };
        } catch (e) {
            res.status(403);
            return { auth: e.message };
        }
    }


    @Get('/depository/wishlist')
    @UseBefore(GoogleMiddleware)
    async getDepositoryWishlist(@Locals('userId') userId: string, @Response() res) {
        try {
            const books = await this.depoHeadless.getWishlistItems(userId);
            return { books };
        } catch (e) {
            res.status(401);
            return { books: [] };
        }
    }


    @Get('/ebay/search/:searchTerm')
    @Get('/ebay/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    async getEbaySearchResults(@PathParams('searchTerm') searchTerm: string, @PathParams('page') page: number = 1, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);
        
        const books = await this.ebayApi.getEbaySearch(searchTerm, page);
        
        return { books };
    }

    @Get('/amazon/search/:searchTerm')
    @Get('/amazon/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    async getAmazonSearchResults(@PathParams('searchTerm') searchTerm: string, @PathParams('page') page: number = 1, @Locals('userId') userId: string) {
        this.sendSearchStatistics(searchTerm, userId);

        const books = await this.amazonHeadless.getAmazonSearch(searchTerm);

        return { books };
    }

    @Get('/internal/wishlist')
    @UseBefore(GoogleMiddleware)
    async getBookItemsOnInternalWishlist(@Locals('userId') userId: string) {
        const internalWishlist = await this.db.getInternalWishlist();
        const entities = await internalWishlist.find({ userId }).toArray();
        const books = entities.map(entity => entity.bookItem);

        return { books };
    }

    @Post('/internal/wishlist')
    @UseBefore(GoogleMiddleware)
    async postBookItemToInternalWishlist(@Required() @BodyParams('bookItem') bookItem: DepositoryBookItem, @Locals('userId') userId: string) {
        const internalWishlist = await this.db.getInternalWishlist();

        await internalWishlist.insertOne({
            userId,
            bookItem
        });

        return bookItem;
    }

    @Get('/all/recent')
    @UseBefore(GoogleMiddleware)
    async getRecentSearches(@Locals('userId') userId) {
        const stats = await this.db.getSearchStatistics();
        const currentStats = await stats.find({ userId }).toArray();
        const recentSearches = currentStats[0].searchArray;

        return { recentSearches };
    }

    @Get('/all/auth')
    @UseBefore(GoogleMiddleware)
    async getAuth(@Locals('userId') userId) {
        return { message: 'true' };
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
