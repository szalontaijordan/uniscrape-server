import { Service, OnInit } from '@tsed/common';
import fetch from 'node-fetch';

import * as _ from 'lodash';
import { config } from '../../../config/vars';
import { EbayKeywordsResult, EbayApiKeywordsResponse } from '../../models/ebay-result.model';
import { EbayAPIException, EbayEmptyResultsException } from '../../models/exceptions/book.exceptions';

const { findingApiProdUrl, query, prodAppId } = config.ebay;

@Service()
export class EbayApiService implements OnInit {
    
    private findUrl = findingApiProdUrl.concat(query).replace('#APPID#', prodAppId);

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
            throw new EbayAPIException('There was a problem with the Ebay API call');
        }

        const resultList = findItemsByKeywordsResponse[0].searchResult[0].item;

        if (!resultList) {
            throw new EbayEmptyResultsException('The result list is empty');
        }

        return resultList;
    }
}
