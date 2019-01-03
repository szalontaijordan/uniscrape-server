import { Service, OnInit } from '@tsed/common';
import { PuppeteerService } from '../shared/puppeteer.service';

@Service()
export class AmazonHeadlessService implements OnInit {

    private amazonSearchURL = 'https://www.amazon.com/s?url=search-alias%3Dstripbooks-intl-ship&field-keywords=#KEYWORDS#&page=#PAGE#';

    constructor(private puppeteerService: PuppeteerService) {
    }
    
    public async $onInit() {
    }

    public async getAmazonSearch(keywords: string, page: number = 1) {
        const URL = this.amazonSearchURL
            .replace('#KEYWORDS#', encodeURIComponent(keywords).replace('%20', '+'))
            .replace('#PAGE#', String(page));
    
        return await this.puppeteerService.getInformationFromPage(URL, this.extractAmazonResults());
    }
    
    private extractAmazonResults() {
        return () => {
            return Array.from(document.getElementsByClassName('s-item-container'))
                .map(result => {
                    const data = result.querySelectorAll('.a-col-right .a-spacing-none');
            
                    if (!data.length) {
                        return null;
                    }
            
                    const title = data[0].getElementsByTagName('h2')[0]['innerText'];
                    const url = data[0].getElementsByTagName('a')[0].href;
                    const category = data[3]['innerText'];
                    const price = data[4]['innerText'].split('\n')[0];
                    const image = result.getElementsByClassName('s-access-image')[0].getAttribute('src');
            
                    return { title, url, category, price, image };
                })
                .filter(book => !!book);
        } 
    }
    
}