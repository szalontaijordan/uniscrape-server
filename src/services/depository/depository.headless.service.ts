import * as _ from 'lodash';
import * as puppeteer from 'puppeteer';
import { Service, OnInit } from '@tsed/common';

import { PuppeteerService } from '../utils/puppeteer.service';

import {
    DepositoryDOMChangedException,
    DepositoryAuthException
} from '../../types/exceptions/book.exceptions';
import { DepositoryWishlistItem } from '../../types/book/depository.type';
import {
    DEPOSITORY_SUCCESSFUL_LOGIN_MESSAGE,
    DEPOSITORY_DOM_CHANGED_AUTO_LOGIN_FAIL_MESSAGE,
    DEPOSITORY_DOM_CHANGED_LOGIN_NOT_FOUND_MESSAGE,
    DEPOSITORY_AUTH_INVALID_CREDENTIALS_MESSAGE,
    DEPOSITORY_AUTH_NOT_LOGGED_IN_MESSAGE,
    DEPOSTIORY_SUCCESSFUL_LOGOUT_MESSAGE
} from '../../types/exceptions/exceptions';

/**
 * Service class for fetching data from Book Depository via Headless Chrome.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class DepositoryHeadlessService implements OnInit {

    private depoLoginURL = 'https://www.bookdepository.com/account/login/to/account';
    private depoWishlistURL = 'https://www.bookdepository.com/account/wishlist?selectCurrency=HUF';

    private browserContextPages: Array<{ id: string, page: puppeteer.Page }>;

    constructor(private puppeteerService: PuppeteerService) {
    }
    
    public $onInit(): void {
        this.browserContextPages = [];
    }

    /**
     * Logs in to Book Depository.
     * 
     * The login page of Book Depository contains two `iframe`s, one of them is the login
     * with the class `signin-iframe`.
     * 
     * The authentication flow is the following:
     * - entering the credentials to the iframes
     * - clicking submit button
     * - wating to redirect to home page
     * - trying to access some page that requires login (e.g. wishlist)
     * 
     * @param email the email used to login in to Book Depository
     * @param password the password used to login in to Book Depository
     * @param userId the Google User Id of the user
     * 
     * @throws `DepositoryDOMChangedException` if anything goes wrong during the automated headless login
     * @throws `DepositoryAuthException` if the credentials are invalid
     */
    public async login(email: string, password: string, userId: string): Promise<string> {
        if (this.browserContextPages.find(page => page.id === userId)) {
            return DEPOSITORY_SUCCESSFUL_LOGIN_MESSAGE;
        }

        const loginPage = await this.createBrowserContextPage(userId);
        await loginPage.waitForSelector('iframe.signin-iframe');

        try {
            await loginPage.evaluate((email, password) => {
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
            throw new DepositoryDOMChangedException(DEPOSITORY_DOM_CHANGED_LOGIN_NOT_FOUND_MESSAGE);
        }

        await loginPage.waitForNavigation();

        if (loginPage.url().indexOf('ap') !== -1) {
            await loginPage.screenshot({ path: './depo.png' });
            this.closeCurrentLoginPage(userId);
            throw new DepositoryDOMChangedException(DEPOSITORY_DOM_CHANGED_AUTO_LOGIN_FAIL_MESSAGE);
        }

        await loginPage.goto(this.depoWishlistURL);

        if (loginPage.url().indexOf('wishlist') === -1) {
            this.closeCurrentLoginPage(userId);
            throw new DepositoryAuthException(DEPOSITORY_AUTH_INVALID_CREDENTIALS_MESSAGE);
        }

        return DEPOSITORY_SUCCESSFUL_LOGIN_MESSAGE;
    }

    /**
     * Returns a list of Book Depository books from the user's wishlist on Book Depository.
     * 
     * @param userId the user's Google User Id, that is associated with a login
     * 
     * @throws `DepositoryAuthException` if the Google User Id cannot be associated with an
     *         existing login (the user is not logged in)
     */
    public async getWishlistItems(userId: string): Promise<Array<DepositoryWishlistItem>> {
        const loginPage = await this.getBrowserContextPageById(userId);
        await loginPage.goto(this.depoWishlistURL);

        return loginPage.evaluate(this.getWishlistFromDOM());
    }

    /**
     * Logs out of Book Depository with the given Google User Id
     * 
     * The logout flow is the following:
     * 
     * - find any link that reads `Sign out` and click it
     * - remove the association berween the Google User Id and the login
     * 
     * @param userId the user's Google User Id, that is associated with a login
     * 
     * @throws `DepositoryAuthException` if the Google User Id cannot be associated with an
     *         existing login (the user is not logged in)
     */
    public async logout(userId: string): Promise<string> {
        const loginPage = await this.getBrowserContextPageById(userId);

        await loginPage.evaluate(() => {
            const logoutLink = Array.from(document.getElementsByTagName('a')).find(a => a.innerText === 'Sign out');
            logoutLink.click();
        });
        await loginPage.waitForNavigation();
        await loginPage.close();
    
        this.browserContextPages = this.browserContextPages.filter(page => page.id !== userId);

        return DEPOSTIORY_SUCCESSFUL_LOGOUT_MESSAGE;
    }

    /**
     * Returns true if the user's Google User Id is associated with a login (the user is logged in)
     * 
     * @param userId the user's Google User Id, that is associated with a login
     * 
     * @throws `DepositoryAuthException` if the Google User Id cannot be associated with an
     *         existing login (the user is not logged in)
     */
    public async isLoggedIn(userId: string): Promise<boolean> {
        const page = await this.getBrowserContextPageById(userId);
        if (!page) {
            throw new DepositoryAuthException(DEPOSITORY_AUTH_NOT_LOGGED_IN_MESSAGE);
        }
        return true;
    }

    private getWishlistFromDOM(): puppeteer.EvaluateFn {
        return () => {
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
        }
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

    private async getBrowserContextPageById(id: string): Promise<puppeteer.Page | null> {
        const existingPage = this.browserContextPages.find(page => page.id === id);
        
        if (existingPage) {
            return existingPage.page;
        } 

        return null;
    }

    private async closeCurrentLoginPage(userId: string): Promise<void> {
        const loginPage = await this.getBrowserContextPageById(userId);
        loginPage.close();
        this.browserContextPages = this.browserContextPages.filter(page => page.id !== userId);
    }
}
