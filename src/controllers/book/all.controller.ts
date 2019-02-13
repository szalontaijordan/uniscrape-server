import { Controller, Locals,  Get, UseBefore, Post } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { StatisticsService } from '../../services/utils/statistics.service';
import { SearchHistory, TrueMessage } from '../../types/book/all.type';

@Controller('/book/all')
export class AllController {

    constructor(private statistics: StatisticsService) {
    }

    @Get('/searchHistory')
    @UseBefore(GoogleMiddleware)
    public async getRecentSearches(@Locals('userId') userId: string): Promise<SearchHistory> {
        const recentSearches = await this.statistics.getSearchStatistics(userId);
        return recentSearches;
    }

    @Get('/auth')
    @UseBefore(GoogleMiddleware)
    public async getAuth(@Locals('userId') userId: string): Promise<TrueMessage> {
        return { message: 'true' };
    }
}
