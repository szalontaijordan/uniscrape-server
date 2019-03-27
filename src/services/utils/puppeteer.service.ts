import * as puppeteer from 'puppeteer';
import { Service, OnInit, OnDestroy } from '@tsed/common';

@Service()
export class PuppeteerService implements OnInit, OnDestroy {
    
    private browser: puppeteer.Browser;
    private chromeConfig: puppeteer.LaunchOptions = {
        headless: true,
        defaultViewport: null,
        slowMo: 10,
        args: [
            '--no-sandbox',
            '--blink-settings=imagesEnabled=true'
        ]
    };

    constructor() {
    }
    
    public $onInit(): void {
        this.launchChrome();
    }

    public $onDestroy(): void {
        this.closeChrome();
    }

    public async openPage(url: string, ...children: Array<string>): Promise<puppeteer.Page> {
        return this.createPage(this.browser, url + children.join('/'));
    }

    public async getInformationFromPage(url: string, evaluateFn: puppeteer.EvaluateFn, ...children: Array<string>): Promise<any> {
        const page = await this.openPage(url, ...children);
        const result = await page.evaluate(evaluateFn);

        page.close();

        return result;
    }

    public async createIncognitoWindow(id: string, url: string): Promise<{ id: string, page: puppeteer.Page }> {
        const context = await this.browser.createIncognitoBrowserContext();
        const page = await this.createPage(context, url);

        console.log('Created Incognito window with id ', id, '...');
        return { id, page };
    }

    private async launchChrome(): Promise<void> {
        try {
            const browser =  await puppeteer.launch(this.chromeConfig);
                
            this.browser = browser;
            console.log('Headless browser started ...');
        } catch (err) {
            console.log(err.message)
        }
    }

    private async closeChrome(): Promise<void> {
        await this.browser.close()
        console.log('Headless browser closed ...');
    }

    private async createPage(context: any & { newPage: () => Promise<puppeteer.Page> }, url: string): Promise<puppeteer.Page> {
        const page = await context.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        await page.setJavaScriptEnabled(true);

        const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
        const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
        await page.setUserAgent(chromeUserAgent);
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.8'
        });

        await page.goto(url);
        await page.evaluate(() => {
            const n = window.navigator['__proto__'];
            delete n.webdriver;
            window.navigator['__proto__'] = n;
            console.log('hacking')
        });

        return page;
    }
}