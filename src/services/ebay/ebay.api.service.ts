import * as _ from 'lodash';
import fetch from 'node-fetch';

import { Service, OnInit } from '@tsed/common';

import { config } from '../../../config/vars';
import { EbayKeywordsResult, EbayApiKeywordsResponse } from '../../types/book/ebay.type';
import { EbayAPIException, EbayEmptyResultsException } from '../../types/exceptions/book.exceptions';
import { EBAY_API_ERROR_MESSAGE, EBAY_EMPTY_RESULTS_MESSAGE } from '../../types/exceptions/exceptions';

/**
 * Service class for fetching data from Ebay with Ebay API.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class EbayApiService implements OnInit {
    
    private findUrl: string;

    constructor() {
    }
    
    public $onInit(): void {
        const { findingApiProdUrl, query, prodAppId } = config.ebay;
        this.findUrl = findingApiProdUrl.concat(query).replace('#APPID#', prodAppId);
    }

    /**
     * Returns a list of Ebay books from Ebay.
     * 
     * This is coming straight from the Ebay API, so there is no extra logic behind this one.
     * 
     * @param keywords the keywords that you do the search on
     * @param page (optional) the page of the results
     * 
     * @throws `EbayAPIException` if the communication with the API was not successful
     * @throws `EbayEmptyResultsException` if the result list is empty
     */
    public async getEbaySearch(keywords: string, page: number = 1): Promise<Array<EbayKeywordsResult>> {
        const url = this.findUrl
            .replace('#KEYWORDS#', encodeURIComponent(keywords))
            .replace('#PAGE', String(page));
            
        const response = await fetch(url);
        const { findItemsByKeywordsResponse } = (await response.json() as EbayApiKeywordsResponse);

        if (findItemsByKeywordsResponse[0].ack[0] !== 'Success') {
            throw new EbayAPIException(EBAY_API_ERROR_MESSAGE);
        }

        const resultList = findItemsByKeywordsResponse[0].searchResult[0].item;

        if (!resultList) {
            throw new EbayEmptyResultsException(EBAY_EMPTY_RESULTS_MESSAGE);
        }

        return resultList;
    }
}
