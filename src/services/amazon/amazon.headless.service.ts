import { Service, OnInit } from '@tsed/common';
import { EvaluateFn } from 'puppeteer';

import { PuppeteerService } from '../utils/puppeteer.service';
import { AmazonEmptyResultsException, AmazonDOMChangedException } from '../../types/exceptions/book.exceptions';
import { AmazonBookItem } from '../../types/book/amazon.type';

import { AMAZON_EMPTY_RESULTS_MESSAGE, AMAZON_DOM_CHANGED_MESSAGE } from '../../types/exceptions/exceptions';

/**
 * Service class for fetching data from Amazon with Headless Chrome.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class AmazonHeadlessService implements OnInit {

    private amazonSearchURL = 'https://www.amazon.com/s?url=search-alias%3Dstripbooks-intl-ship&field-keywords=#KEYWORDS#&page=#PAGE#';

    constructor(private puppeteerService: PuppeteerService) {
    }
    
    public $onInit(): void {
    }

    /**
     * Returns a list of Amazon books from Amazon.
     * 
     * This is based on the following DOM structure
     * 
     * ```
     * .s-item-container
     *   & > .a-col-right .a-spacing-none
     * ```
     * 
     * The children includes the following fields in order:
     * 
     * ```
     * title, url, category, price, image
     * ```
     * 
     * @param keywords the keywords that you do the search on
     * @param page (optional) the page of the results
     * 
     * @throws `AmazonEmptyResultsException` if the result lis is empty
     */
    public async getAmazonSearch(keywords: string, page: number = 1): Promise<Array<AmazonBookItem>> {
        const URL = this.amazonSearchURL
            .replace('#KEYWORDS#', encodeURIComponent(keywords).replace('%20', '+'))
            .replace('#PAGE#', String(page));
        const resultList = await this.puppeteerService.getInformationFromPage(URL, this.extractAmazonResults());

        if (!resultList.length) {
            throw new AmazonEmptyResultsException(AMAZON_EMPTY_RESULTS_MESSAGE);
        }

        return resultList;    
    }
    
    private extractAmazonResults(): EvaluateFn {
        try {   
            return () => {
                return Array.from(document.getElementsByClassName('s-item-container'))
                    .map(result => {
                        const data = result.querySelectorAll('.a-col-right .a-spacing-none');
                
                        if (!data.length) {
                            return null;
                        }
                
                        const title = data[0].getElementsByTagName('h2')[0]['innerText'];
                        const url = data[0].getElementsByTagName('a')[0].href;
                        const category = data[4] ? data[3]['innerText'] : data[2]['innerText'];
                        const price = data[4] ? data[4]['innerText'].split('\n')[0] : data[3]['innerText'].split('\n')[0];
                        const image = result.getElementsByClassName('s-access-image')[0].getAttribute('src');
                
                        return { title, url, category, price, image };
                    })
                    .filter(book => !!book);
            } 
        } catch (e) {
            throw new AmazonDOMChangedException(AMAZON_DOM_CHANGED_MESSAGE);
        }
    }
}
