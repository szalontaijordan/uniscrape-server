import { Service, OnInit, OnDestroy } from '@tsed/common';
import * as puppeteer from 'puppeteer';

@Service()
export class PuppeteerService implements OnInit, OnDestroy {
    
    private browser: puppeteer.Browser;
    
    constructor() {
    }
    
    public $onInit() {
        puppeteer.launch({ headless: true, devtools: false }).then(browser => this.browser = browser).catch(err => console.log(err.message));
    }

    public $onDestroy() {
        this.browser.close();
    }

    public async getInformationFromPage(url: string, evaluateFn: puppeteer.EvaluateFn, ...children: Array<string>): Promise<any> {
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