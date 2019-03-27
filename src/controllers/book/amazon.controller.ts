import { Controller, Locals,  Get, UseBefore, PathParams } from '@tsed/common';
import { NotFound, InternalServerError } from 'ts-httpexceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';

import { AmazonEmptyResultsException } from '../../types/exceptions/book.exceptions';
import { CommonBookList } from '../../types/book/all.type';

import { AmazonHeadlessService } from '../../services/amazon/amazon.headless.service';
import { StatisticsService } from '../../services/utils/statistics.service';
import { BookTransformerService } from '../../services/utils/book-transformer.service';

/**
 * Controller class for the `/book/amazon` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/book/amazon')
export class AmazonController {

    constructor(private statistics: StatisticsService,
                private amazonHeadless: AmazonHeadlessService,
                private bookTransformer: BookTransformerService) {
    }

    /**
     * Returns a list of books from Amazon based on the `searchTerm`.
     *
     * Also sends the searched term for statistics.
     *  
     * @param searchTerm a string that will represent the search keyword
     * @param page (optional) the page number of the results
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `NotFount` if the result list is empty
     * @throws `InternalServerError` if there are some unknown problems (e.g. Amazon DOM changed thus cannot be parsed)
     */
    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getAmazonSearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<CommonBookList> {
        try {
            const books = await this.amazonHeadless.getAmazonSearch(searchTerm, page);
            return { books: books.map(this.bookTransformer.transformAmazonToCommon) };
        } catch (e) {
            if (e instanceof AmazonEmptyResultsException) {
                throw new NotFound(e.message);
            }
            throw new InternalServerError(e.message);
        } finally {
            this.statistics.sendSearchStatistics(searchTerm, userId);
        }
    }
}
