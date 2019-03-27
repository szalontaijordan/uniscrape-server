import { Controller, Locals,  Get, UseBefore, PathParams } from '@tsed/common';
import { InternalServerError, NotFound } from 'ts-httpexceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';

import { EbayAPIException } from '../../types/exceptions/book.exceptions';

import { EbayApiService } from '../../services/ebay/ebay.api.service';
import { StatisticsService } from '../../services/utils/statistics.service';
import { CommonBookList } from '../../types/book/all.type';
import { BookTransformerService } from '../../services/utils/book-transformer.service';

/**
 * Controller class for the `/book/ebay` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/book/ebay')
export class EbayController {

    constructor(private statistics: StatisticsService,
                private ebayApi: EbayApiService,
                private bookTransformer: BookTransformerService) {
    }

    /**
     * Returns a list of books from Ebay based on the `searchTerm`.
     *
     * Also sends the searched term for statistics.
     *  
     * @param searchTerm a string that will represent the search keyword
     * @param page (optional) the page number of the results
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `NotFount` if the result list is empty
     * @throws `InternalServerError` if there are some unknown problems with the Ebay API
     */
    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getEbaySearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<CommonBookList> {
        try {
            const books = await this.ebayApi.getEbaySearch(searchTerm, page);
            return { books: books.map(this.bookTransformer.transformEbayToCommon) };
        } catch (e) {
            if (e instanceof EbayAPIException) {
                throw new InternalServerError(e.message);
            }
            throw new NotFound(e.message);
        } finally {
            this.statistics.sendSearchStatistics(searchTerm, userId);
        }
    }
}
