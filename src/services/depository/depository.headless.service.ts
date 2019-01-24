import { Service, OnInit } from '@tsed/common';
import { JSDOM } from 'jsdom';
import { DepositoryBookItem, DepositoryWishlistItem } from '../../models/depository-book-item.model';

import * as puppeteer from 'puppeteer';
import * as _ from 'lodash';
import { PuppeteerService } from '../shared/puppeteer.service';
import { BookDepositoryDOMChangedException, BookDepositoryAuthException } from '../../models/exceptions/book.exceptions';

@Service()
export class DepositoryHeadlessService implements OnInit {

    private depoLoginURL = 'https://www.bookdepository.com/account/login/to/account';
    private depoWishlistURL = 'https://www.bookdepository.com/account/wishlist';

    private loginPage: puppeteer.Page;

    private browserContextPages: Array<{ id: string, page: puppeteer.Page }>;

    constructor(private puppeteerService: PuppeteerService) {
    }
    
    public async $onInit() {
        this.browserContextPages = [];
    }

    public async login(email: string, password: string, userId: string): Promise<string> {
        if (this.browserContextPages.find(page => page.id === userId)) {
            return 'Successful login with given Google ID';
        }

        this.loginPage = await this.createBrowserContextPage(userId);
        
        await this.loginPage.waitForSelector('iframe.signin-iframe');

        try {
            await this.loginPage.evaluate((email, password) => {
                const frame = document.getElementsByClassName('signin-iframe')[0]['contentWindow']['document'];
                
                const emailInput = frame.getElementById('ap_email');
                const passwordInput = frame.getElementById('ap_password');
                const submitButton = frame.getElementById('signInSubmit');
                const keepMeLoggedIn = frame.getElementsByName('rememberMe')[0];
    
                emailInput.value = email;
                passwordInput.value = password;
                keepMeLoggedIn.value = false;
    
                submitButton.click();
            }, email, password);
        } catch (e) {
            this.closeCurrentLoginPage(userId);
            throw new BookDepositoryDOMChangedException('Currrent selectors were unable to find the login form');
        }

        await this.loginPage.waitForNavigation();

        if (this.loginPage.url().indexOf('ap') !== -1) {
            this.closeCurrentLoginPage(userId);
            throw new BookDepositoryDOMChangedException('Automated headless login failed');
        }

        await this.loginPage.goto(this.depoWishlistURL);

        if (this.loginPage.url().indexOf('wishlist') === -1) {
            this.closeCurrentLoginPage(userId);
            throw new BookDepositoryAuthException('Invalid credentials');
        }

        return 'Successful login with given Google ID';
    }

    public async getWishlistItems(userId: string): Promise<Array<DepositoryWishlistItem>> {
        this.loginPage = await this.getBrowserContextPageById(userId);

        if (!this.loginPage) {
            throw new BookDepositoryAuthException('You are not logged in.');
        }

        await this.loginPage.goto(this.depoWishlistURL);

        return this.loginPage.evaluate(() => {
            return Array.from(document.getElementsByClassName('book-list-item'))
                .map(book => {
                    const authorElement = book.getElementsByClassName('author')[0];
                    const titleElement = book.getElementsByTagName('h2')[0];
                    const imageElement = book.getElementsByTagName('img')[0];
                    const priceElement = book.getElementsByClassName('price')[0];

                    const currentPrice = priceElement['innerText'].replace(/\s/g, '').match(/[0-9]+/g);

                    return {
                        currentPrice: currentPrice ? Number(currentPrice[0]) : -1,
                        image: imageElement.getAttribute('src'),
                        title: titleElement['innerText'],
                        url: titleElement.firstElementChild.getAttribute('href'),
                        author: {
                            name: authorElement['innerText'],
                            url: authorElement.firstElementChild.getAttribute('href')
                        }
                    };
                });
        });
    }

    public async logout(userId: string): Promise<string> {
        this.loginPage = await this.getBrowserContextPageById(userId);

        if (!this.loginPage) {
            throw new BookDepositoryAuthException('You cannot log out, if you are not logged in.');
        }

        await this.loginPage.evaluate(() => {
            const logoutLink = Array.from(document.getElementsByTagName('a')).find(a => a.innerText === 'Sign out');
            logoutLink.click();
        });
        await this.loginPage.waitForNavigation();
        await this.loginPage.close();
    
        this.browserContextPages = this.browserContextPages.filter(page => page.id !== userId);

        return 'Successful logout with the given Google ID.';
    }

    private async createBrowserContextPage(id: string): Promise<puppeteer.Page> {
        const existingPage = this.browserContextPages.find(page => page.id === id);
        
        if (existingPage) {
            return existingPage.page;
        } else {
            const newPage = await this.puppeteerService.createIncognitoWindow(id, this.depoLoginURL);
            this.browserContextPages.push(newPage);
            return newPage.page;
        }
    }

    private async getBrowserContextPageById(id: string): Promise<puppeteer.Page> {
        const existingPage = this.browserContextPages.find(page => page.id === id);
        
        if (existingPage) {
            return existingPage.page;
        } 

        return null;
    }

    private async closeCurrentLoginPage(userId: string): Promise<void> {
        await this.loginPage.close();
            this.browserContextPages = this.browserContextPages.filter(page => page.id !== userId);
            
    }
}
