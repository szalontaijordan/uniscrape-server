import { Service, OnInit } from '@tsed/common';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { DepositoryBookItem } from '../../models/depository-book-item.model';

import * as microdata from 'microdata-node';
import * as _ from 'lodash';

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
        
        const query = '.block-wrap:not([class*="no"]):not([class*="side"]):not([class*="one"]) h2';
        const titles = Array.from(document.querySelectorAll(query)).map(h2 => h2['textContent']);
        
        return titles;
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

    public async getDepositorySearch(searchTerm: string, page: number = 1) {
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
        const price = dom.window.document.querySelector('.price-wrap');
        
        image.setAttribute('itemprop', 'image');
        image.setAttribute('src', image.getAttribute('data-lazy'));

        price.setAttribute('itemprop', 'price');

        return dom.serialize();
    }

    private createBookItemFrom(response: any): DepositoryBookItem {
        const props = response.items[0].properties;
        const currentPriceProp = props.price[0].replace(/\s/g, '').match(/[0-9]+/g);

        const bookItem: DepositoryBookItem = {
            published: new Date(props.datePublished[0]),
            title: props.name[0],
            ISBN: props.isbn[0],
            currentPrice: currentPriceProp ? Number(currentPriceProp) : -1,
            image: props.image[0],
            author: null
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
        return _.map(_.toArray(books), (book: Element) => {
            const enrichedBook = this.generateAdditionalMetadataFor(book);
            const bookItem = this.createBookItemFrom(microdata.toJson(enrichedBook));

            return bookItem;
        });
    }
}