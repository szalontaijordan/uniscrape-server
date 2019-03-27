import * as _ from 'lodash';
import * as microdata from 'microdata-node';
import fetch from 'node-fetch';

import { Service, OnInit } from '@tsed/common';
import { JSDOM } from 'jsdom';

import { DepositoryBookItem } from '../../types/book/depository.type';

import {
    DepositoryDOMChangedException,
    DepositoryEmptyResultsException
} from '../../types/exceptions/book.exceptions';
import { DEPOSITORY_DOM_CHANGED_MESSAGE, DEPOSITORY_EMPTY_RESULTS_MESSAGE, InvalidISBNException, INVALID_ISBN_MESSAGE } from '../../types/exceptions/exceptions';

import { config } from '../../../config/vars';

/**
 * Service class for fetching data from Book Depository from its DOM.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class DepositoryDOMService implements OnInit {
    
    private depoHomeURL = 'https://www.bookdepository.com?selectCurrency=HUF';
    private depoSearchURL = 'https://www.bookdepository.com/search?searchTerm=#SEARCHTERM#&page=#PAGE#&selectCurrency=HUF';

    constructor() {
    }
    
    public $onInit(): void {
    }

    /**
     * Returns a list of section names from the home page of Book Depository.
     * 
     * The CSS selector used to get the sections is the following:
     * 
     * ```
     * .block-wrap:not([class*="no"]):not([class*="side"]):not([class*="one"]) h2
     * ```
     * 
     * @throws `DepositoryDOMChangedException` if the selector above cannot find the sections
     */
    public async getDepositoryHomeSections(): Promise<Array<string>> {
        const html = await fetch(this.depoHomeURL);
        const document = new JSDOM(await html.text()).window.document;
        
        try {
            const query = '.block-wrap:not([class*="no"]):not([class*="side"]):not([class*="one"]) h2';
            const titles = _.map(_.toArray(document.querySelectorAll(query)), h2 => h2['textContent']);
        
            return titles;
        } catch (e) {
            throw new DepositoryDOMChangedException(DEPOSITORY_DOM_CHANGED_MESSAGE);
        }
    }

    /**
     * Returns a list of Book Depository books from a given section on the home page of Book Depository.
     * 
     * The data is retrieved via parsing the microdata that is available, and what we add to it (e.g. price, etc.)
     * 
     * This uses the following approach:
     * 
     * - use selector: `[data-title="${section}"]`
     * - get to the parent element of the parent element
     * - find all elements with the class `book-item`
     * 
     * 
     * @param section the name of the section
     * 
     * @throws `DepositoryEmptyResultsException` if the result list is empty
     */
    public async getDepositoryHomeBooksBySection(section: string): Promise<Array<DepositoryBookItem>> {
        const html = await fetch(this.depoHomeURL);
        const document = new JSDOM(await html.text()).window.document;

        const books = document
            .querySelector(`[data-title="${section}"]`)
            .parentElement
            .parentElement
            .getElementsByClassName('book-item');

        return this.mapElementsToBookItems(books);
    }

    /**
     * Returns a list of Book Depository books for a given search in Book Depository.
     * 
     * The data is retrieved via parsing the microdata that is available, and what we add to it (e.g. price, etc.)
     * 
     * This uses the following approach:
     * 
     * - the search page's url is the following:
     * ```
     * https://www.bookdepository.com/search?searchTerm=#SEARCHTERM#&page=#PAGE#&selectCurrency=HUF
     * ```
     * - substitute the search term and the page number into the url above
     * - parse the elements on the page that have the class `book-item` 
     * 
     * @throws `DepositoryEmptyResultsException` if the result list is empty
     */
    public async getDepositorySearch(searchTerm: string, page: number = 1): Promise<Array<DepositoryBookItem>> {
        const url = this.depoSearchURL
            .replace('#SEARCHTERM#', encodeURIComponent(searchTerm))
            .replace('#PAGE#', String(page));

        const html = await fetch(url);
        const document = new JSDOM(await html.text()).window.document;

        const books = document.getElementsByClassName('book-item');

        return this.mapElementsToBookItems(books);
    }

    /**
     * Returns a single Book Depository book based on the given ISBN number.
     * 
     * If the searchterm for the search is a valid ISBN number, Book Depository
     * redirects to the book's own page on the site. This can be leveraged to return a single
     * book entity.
     * 
     * @param ISBN the ISBN number of a book (can be in any valid ISBN form)
     * 
     * @throws `InvalidISBNException` if the given ISBN is not valid
     * @throws `DepositoryEmptyResultsException` if the page didn't contain a book
     */
    public async getDepositoryBookByISBN(ISBN: string): Promise<DepositoryBookItem> {
        if (!this.isValidISBN(ISBN)) {
            throw new InvalidISBNException(INVALID_ISBN_MESSAGE);
        }
        const url = this.depoSearchURL
            .replace('#SEARCHTERM#', ISBN)
            .replace('#PAGE#', '');
        const html = await fetch(url);

        const window = new JSDOM(await html.text()).window;
        const book = window.document.getElementsByClassName('item-wrap');

        return {
            ...this.mapElementsToBookItems(book)[0],
            linkToBook: url
        };
    }

    private generateAdditionalMetadataFor(book: Element): string {
        const dom = new JSDOM(book.outerHTML);

        const { document } = dom.window;

        const image = document.querySelector('.item-img img');
        const price = document.querySelector('.price');
        const linkToBook = document.querySelector('.item-img a');
        
        if (image) {
            image.setAttribute('itemprop', 'image');

            if (image.getAttribute('data-lazy')) {
                image.setAttribute('src', image.getAttribute('data-lazy'));
            }
        }
        
        if (price) {
            price.setAttribute('itemprop', 'price');
        }

        if (linkToBook) {
            linkToBook.setAttribute('itemprop', 'linkToBook');
        }

        return dom.serialize();
    }

    private createBookItemFrom(response: any & { items: Array<object & { properties: object}>}): DepositoryBookItem {
        const props = response.items[0].properties;

        const bookItem: DepositoryBookItem = {
            published: new Date(props.datePublished[0]).toJSON(),
            title: props.name[0],
            ISBN: props.isbn[0],
            image: props.image[0],
            currentPrice: -1,
            author: null
        }

        if (props.price) {
            const pricesArray = props.price[0].replace(/\s/g, '').match(/[0-9]+/g);
            
            if (pricesArray) {
                bookItem.currentPrice = Number(pricesArray[0]);
            }
        }

        if (props.author) {
            bookItem.author = {
                name: props.author[0].properties.name[0].trim(),
                url: props.author[0].properties.url[0],
            }    
        }

        if (props.linkToBook) {
            bookItem.linkToBook = props.linkToBook[0];
        }
        
        return bookItem;
    }

    private mapElementsToBookItems(books: NodeListOf<Element> | HTMLCollectionOf<Element>): Array<DepositoryBookItem> {
        if (!books.length) {
            throw new DepositoryEmptyResultsException(DEPOSITORY_EMPTY_RESULTS_MESSAGE);
        }

        return _.map(_.toArray(books), (book: Element) => {
            const enrichedBook = this.generateAdditionalMetadataFor(book);
            const bookItem = this.createBookItemFrom(microdata.toJson(enrichedBook));

            return bookItem;
        });
    }

    private isValidISBN(ISBN: string): boolean {
        return !!config.regex.ISBN_VALIDATOR.exec(ISBN);
    }
}
