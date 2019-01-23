import { Service, OnInit } from '@tsed/common';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { DepositoryBookItem } from '../../models/depository-book-item.model';

import * as microdata from 'microdata-node';
import * as _ from 'lodash';
import { BookDepositoryDOMChangedException } from '../../models/exceptions/book.exceptions';

@Service()
export class DepositoryDOMService implements OnInit {
    
    private depoHomeURL = 'https://www.bookdepository.com/';
    private depoSearchURL = 'https://www.bookdepository.com/search?searchTerm=#SEARCHTERM#&page=#PAGE#';

    constructor() {
    }
    
    public async $onInit() {
    }

    public async getDepositoryHomeSections(): Promise<Array<string>> {
        const html = await fetch(this.depoHomeURL);
        const document = new JSDOM(await html.text()).window.document;
        
        try {
            const query = '.block-wrap:not([class*="no"]):not([class*="side"]):not([class*="one"]) h2';
            const titles = _.map(_.toArray(document.querySelectorAll(query)), h2 => h2['textContent']);
        
            return titles;
        } catch (e) {
            throw new BookDepositoryDOMChangedException('Failed to scrape sections with the current CSS selector.');
        }
    }

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

    public async getDepositorySearch(searchTerm: string, page: number = 1): Promise<Array<DepositoryBookItem>> {
        const url = this.depoSearchURL
            .replace('#SEARCHTERM#', encodeURIComponent(searchTerm))
            .replace('#PAGE#', String(page));

        const html = await fetch(url);
        const document = new JSDOM(await html.text()).window.document;

        const books = document.getElementsByClassName('book-item');

        return this.mapElementsToBookItems(books);
    }

    private generateAdditionalMetadataFor(book: Element): string {
        const dom = new JSDOM(book.outerHTML);
        const image = dom.window.document.querySelector('.item-img img');
        const price = dom.window.document.querySelector('.price');
        
        if (image) {
            image.setAttribute('itemprop', 'image');
            image.setAttribute('src', image.getAttribute('data-lazy'));
        }
        
        if (price) {
            price.setAttribute('itemprop', 'price');
        }

        return dom.serialize();
    }

    private createBookItemFrom(response: any): DepositoryBookItem {
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
                name: props.author[0].properties.name[0],
                url: props.author[0].properties.url[0],
            }    
        }
        
        return bookItem;
    }

    private mapElementsToBookItems(books: NodeListOf<Element> | HTMLCollectionOf<Element>): Array<DepositoryBookItem> {
        if (!books.length) {
            throw new BookDepositoryDOMChangedException('The list of the books scraped by the current selector is empty.');
        }

        return _.map(_.toArray(books), (book: Element) => {
            const enrichedBook = this.generateAdditionalMetadataFor(book);
            const bookItem = this.createBookItemFrom(microdata.toJson(enrichedBook));

            return bookItem;
        });
    }
}
