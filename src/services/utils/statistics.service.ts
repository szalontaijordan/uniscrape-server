import { Service, OnInit } from '@tsed/common';
import { DatabaseService } from './db.service';

@Service()
export class StatisticsService implements OnInit {
    
    constructor(private db: DatabaseService) {
    }
    
    public $onInit(): void {
    }

    public async sendSearchStatistics(searchTerm: string, userId: string): Promise<void> {
        const stats = await this.db.getSearchStatistics();
        const currentStats = await stats.find({ userId }).toArray();
        const existingArray = currentStats[0].searchArray;
    
        const newArray = Array
            .from(new Set([decodeURIComponent(searchTerm), ...existingArray]))
            .slice(0, 15);
    
        await stats.updateOne({ userId }, { $set: { searchArray: newArray } });
    }

    public async getSearchStatistics(userId: string): Promise<Array<string>> {
        const stats = await this.db.getSearchStatistics();
        const currentStats = await stats.find({ userId }).toArray();
        const recentSearches = currentStats[0].searchArray;

        return recentSearches;
    }
}
