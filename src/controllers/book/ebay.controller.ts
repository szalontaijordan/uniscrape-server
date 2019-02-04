import { Controller, Locals,  Get, UseBefore, PathParams } from '@tsed/common';
import { InternalServerError, NotFound } from 'ts-httpexceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';

import { EbayAPIException } from '../../types/exceptions/book.exceptions';
import { EbayBookList } from '../../types/book/ebay.type';

import { EbayApiService } from '../../services/ebay/ebay.api.service';
import { StatisticsService } from '../../services/utils/statistics.service';

@Controller('/book/ebay')
export class EbayController {

    constructor(private statistics: StatisticsService,
                private ebayApi: EbayApiService) {
    }

    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getEbaySearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<EbayBookList> {
        try {
            const books = await this.ebayApi.getEbaySearch(searchTerm, page);
            return { books };
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
