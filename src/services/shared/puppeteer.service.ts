import { Service, OnInit, OnDestroy } from '@tsed/common';
import * as puppeteer from 'puppeteer';

@Service()
export class PuppeteerService implements OnInit, OnDestroy {
    
    private browser: puppeteer.Browser;
    
    constructor() {
    }
    
    public $onInit() {
        puppeteer.launch({ headless: true })
            .then(browser => {
                this.browser = browser;
                console.log('Headless browser started ...');
            })
            .catch(err => console.log(err.message));
    }

    public $onDestroy() {
        this.browser.close();
    }

    public async openPage(url: string, ...children: Array<string>): Promise<puppeteer.Page> {
        const page = await this.browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.setJavaScriptEnabled(true);

        await page.goto(url + children.join('/'));

        return page;
    }

    public async getInformationFromPage(url: string, evaluateFn: puppeteer.EvaluateFn, ...children: Array<string>): Promise<any> {
        const page = await this.openPage(url, ...children);
        const result = await page.evaluate(evaluateFn);

        page.close();

        return result;
    }

    public async createIncognitoWindow(id: string, url: string): Promise<{ id: string, page: puppeteer.Page }> {
        const context = await this.browser.createIncognitoBrowserContext();
        console.log('Created Incognito window with id ', id, '...');
        const page = await context.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.setJavaScriptEnabled(true);

        await page.goto(url);

        return { id, page };
    }
}