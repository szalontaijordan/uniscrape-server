import { Controller, Locals,  Get, UseBefore, Post } from '@tsed/common';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { StatisticsService } from '../../services/utils/statistics.service';
import { SearchHistory, TrueMessage } from '../../types/book/all.type';

/**
 * Controller class for the `/book/all` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/book/all')
export class AllController {

    constructor(private statistics: StatisticsService) {
    }

    /**
     * Retrieves the search history of a user based on their Google User Id.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     */
    @Get('/searchHistory')
    @UseBefore(GoogleMiddleware)
    public async getRecentSearches(@Locals('userId') userId: string): Promise<SearchHistory> {
        const recentSearches = await this.statistics.getSearchStatistics(userId);
        return recentSearches;
    }

    /**
     * Returns a simple message if the Google User Id can be resolved.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     */
    @Get('/auth')
    @UseBefore(GoogleMiddleware)
    public async getAuth(@Locals('userId') userId: string): Promise<TrueMessage> {
        return { message: 'true' };
    }
}
