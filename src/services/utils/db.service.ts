import * as mongodb from 'mongodb';
import { Service, OnInit } from '@tsed/common';

import { config } from '../../../config/vars';

@Service()
export class DatabaseService implements OnInit {
    
    private client: mongodb.MongoClient;
    
    constructor() {
    }
    
    public $onInit(): Promise<void> {
        return mongodb.MongoClient.connect(config.db.testURI, { useNewUrlParser: true })
            .then(client => {
                this.client = client;
                console.log('MongoDB connected to test URI');
            });
    }

    public async getInternalWishlist(): Promise<mongodb.Collection<any>> {
        return this.client.db('uniscrape_test').collection('internal-wishlist');
    }

    public async getSearchStatistics(): Promise<mongodb.Collection<any>> {
        return this.client.db('uniscrape_test').collection('search-statistics');
    }

    public getClient(): mongodb.MongoClient {
        return this.client;
    }
}