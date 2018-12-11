import { Service, OnInit } from '@tsed/common';
import * as mongodb from 'mongodb';
import { config } from '../../config/vars';

@Service()
export class DatabaseService implements OnInit {
    
    private client;
    
    constructor() {
    }
    
    public async $onInit() {
        this.client = await mongodb.MongoClient.connect(config.db.testURI, { useNewUrlParser: true });
    }

    public async getInternalWishlist() {
        return this.client.db('uniscrape_test').collection('internal-wishlist');
    }

    public async getSearchStatistics() {
        return this.client.db('uniscrape_test').collection('search-statistics');
    }

    public getClient() {
        return this.client;
    }
}