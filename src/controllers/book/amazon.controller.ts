import { Controller, Locals,  Get, UseBefore, PathParams } from '@tsed/common';
import { NotFound, InternalServerError } from 'ts-httpexceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';

import { AmazonEmptyResultsException } from '../../types/exceptions/book.exceptions';
import { AmazonBookList } from '../../types/book/amazon.type';

import { AmazonHeadlessService } from '../../services/amazon/amazon.headless.service';
import { StatisticsService } from '../../services/utils/statistics.service';

@Controller('/book/amazon')
export class AmazonController {

    constructor(private statistics: StatisticsService,
                private amazonHeadless: AmazonHeadlessService) {
    }

    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getAmazonSearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<AmazonBookList> {
        try {
            const books = await this.amazonHeadless.getAmazonSearch(searchTerm, page);
            return { books };
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
