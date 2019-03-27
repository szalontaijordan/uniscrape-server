import { Service, OnInit } from '@tsed/common';
import { SearchHistory } from '../../types/book/all.type';
import { SearchHistoryItemModel } from '../../models/search-history-item';

/**
 * Utility service class for saving statistics like recent searches.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class StatisticsService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
    }

    /**
     * Persists a search history to the user's statistics.
     * 
     * @param searchTerm the term that was searched
     * @param userId the Google User Id of a user
     */
    public async sendSearchStatistics(searchTerm: string, userId: string): Promise<void> {
        const history = await SearchHistoryItemModel.findOne({ userId });
        const { recentSearches } = history.searchHistory;

        if (recentSearches.map(item => item.term).indexOf(searchTerm) >= 0) {
            return;
        }
    
        history.searchHistory = {
            ...history.searchHistory,
            recentSearches: [ { term: searchTerm, date: new Date() }, ...recentSearches ].slice(0, 20)
        };

        await history.save();
    }

    /**
     * Returns a list of search history entities from the user's statistics.
     * 
     * @param userId the Google User Id of a user
     */
    public async getSearchStatistics(userId: string): Promise<SearchHistory> {
        const history = await SearchHistoryItemModel.findOne({ userId });

        if (!history) {
            await this.createSearchStatistics(userId);
            return { recentSearches: [] };
        }

        return history.searchHistory;
    }

    private async createSearchStatistics(userId: string): Promise<void> {
        const history = new SearchHistoryItemModel({ userId, searchHistory: { recentSearches: [] } });
        await history.save();
    }
}
