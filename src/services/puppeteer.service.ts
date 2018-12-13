import { Service, OnInit, OnDestroy } from '@tsed/common';
import * as puppeteer from 'puppeteer';

@Service()
export class PuppeteerService implements OnInit, OnDestroy {
    
    private browser;
    private ebaySearchURL = 'https://www.ebay.com/sch/Books/267/i.html?_nkw=#SEARCHTERM#';
    private amazonSearchURL = 'https://www.amazon.com/s?field-keywords=#SEARCHTERM#';
    
    constructor() {
    }
    
    public $onInit() {
        puppeteer.launch().then(browser => this.browser = browser).catch(err => console.log(err.message));
    }

    public $onDestroy() {
        this.browser.close();
    }

    public async getEbaySearch(searchTerm: string) {
        const URL = this.ebaySearchURL.replace('#SEARCHTERM#', searchTerm);
        return await this.getInformationFromPage(URL, this.extractEbayResults());
    }

    public async getAmazonSearch(searchTerm: string) {
        const URL = this.amazonSearchURL
            .replace('#SEARCHTERM#', encodeURIComponent(searchTerm));
        return await this.getInformationFromPage(URL, this.extractAmazonResults());
    }

    private extractEbayResults(): puppeteer.EvaluateFn {
        return () => {
            // @ts-ignore
            
            return Array.from(document.querySelectorAll('#ListViewInner > li'))
                .map(book => {
                    // @ts-ignore
                    const title = book.getElementsByTagName('h3')[0] ? book.getElementsByTagName('h3')[0].innerText : '';
                    // @ts-ignore
                    const image = book.getElementsByTagName('img')[0].src;
                    // @ts-ignore
                    const status = book.getElementsByClassName('lvsubtitle')[0] ? book.getElementsByClassName('lvsubtitle')[0].innerText : '';
                    // @ts-ignore
                    const price = book.getElementsByClassName('prc')[0] ? book.getElementsByClassName('prc')[0].innerText : '';
                    // @ts-ignore
                    const url = book.getElementsByTagName('a')[0].href;
                    
                    return { title, image, status, price,url }
                });
        }
    }

    private extractAmazonResults() {
        return () => {
            // @ts-ignore
            return 'TODO';
        } 
    }

    private async getInformationFromPage(url: string, evaluateFn: puppeteer.EvaluateFn, ...children: Array<string>): Promise<any> {
        const page = await this.browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.setJavaScriptEnabled(true);
        const URL = url + children.join('/');

        await page.goto(URL);

        const result = await page.evaluate(evaluateFn);

        page.close();

        return result;
    }
}