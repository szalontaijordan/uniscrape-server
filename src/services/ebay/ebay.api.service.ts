import { Service, OnInit } from '@tsed/common';
import fetch from 'node-fetch';

import * as _ from 'lodash';
import { config } from '../../../config/vars';
import { EbayKeywordsResult, EbayApiKeywordsResponse } from '../../models/ebay-result.model';

@Service()
export class EbayApiService implements OnInit {
    
    private findUrl = config.ebay.findingApiProdUrl.concat(config.ebay.query).replace('#APPID#', config.ebay.prodAppId);

    constructor() {
    }
    
    public async $onInit() {
    }

    public async getEbaySearch(keywords: string, page: number = 1): Promise<Array<EbayKeywordsResult>> {
        const url = this.findUrl
            .replace('#KEYWORDS#', encodeURIComponent(keywords))
            .replace('#PAGE', String(page));
            
        const response = await fetch(url);
        const { findItemsByKeywordsResponse } = (await response.json() as EbayApiKeywordsResponse);

        if (findItemsByKeywordsResponse[0].ack[0] !== 'Success') {
            return [];
        }

        return findItemsByKeywordsResponse[0].searchResult[0].item;
    }
}
