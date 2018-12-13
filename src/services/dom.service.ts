import { Service, OnInit } from '@tsed/common';
import * as request from 'request-promise';
import { JSDOM } from 'jsdom';
import * as microdata from 'microdata-node';
import { BookItem } from '../models/book-item.model';

@Service()
export class DOMService implements OnInit {
    
    private depoHomeURL = 'https://www.bookdepository.com/';
    private depoSearchURL = 'https://www.bookdepository.com/search?searchTerm=#SEARCHTERM#&page=#PAGE#';

    constructor() {
    }
    
    public async $onInit() {
    }

    public async getDepositoryHomeSections(): Promise<Array<string>> {
        const options = { url: this.depoHomeURL, method: 'GET' };

        const html = await request(options);
        const document = new JSDOM(html).window.document;
        
        const query = '.block-wrap:not([class*="no"]):not([class*="side"]):not([class*="one"]) h2';
        const titles = Array.from(document.querySelectorAll(query)).map(h2 => h2['textContent']);
        
        return titles;
    }

    public async getDepositoryHomeBooksBySection(section: string): Promise<Array<BookItem>> {
        const options = { url: this.depoHomeURL, method: 'GET' };

        const html = await request(options);
        const document = new JSDOM(html).window.document;

        const query = `[data-title="${section}"]`;
        const books = document.querySelector(query)
            .parentElement
            .parentElement
            .lastElementChild
            .children[1]
            .lastElementChild
            .children;

        return Array
            .from(books)
            .map(book => this.generateAdditionalMetadataFor(book))
            .map(book => this.createBookItemFrom(microdata.toJson(book)));
    }

    public async getDepositorySearch(searchTerm: string, page: number = 1) {
        const url = this.depoSearchURL
            .replace('#SEARCHTERM#', encodeURIComponent(searchTerm))
            .replace('#PAGE#', String(page));

        const options = { url, method: 'GET' };

        const html = await request(options);
        const document = new JSDOM(html).window.document;

        const books = document.getElementsByClassName('book-item');

        return Array
            .from(books)
            .map(book => this.generateAdditionalMetadataFor(book))
            .map(book => this.createBookItemFrom(microdata.toJson(book)));
    }

    private generateAdditionalMetadataFor(book: any): string {
        const dom = new JSDOM(book['outerHTML']);
        const image = dom.window.document.querySelector('.item-img img');
        const price = dom.window.document.querySelector('.price-wrap');
        
        image.setAttribute('itemprop', 'image');
        image.setAttribute('src', image.getAttribute('data-lazy'));

        price.setAttribute('itemprop', 'price');

        return dom.serialize();
    }

    private createBookItemFrom(response: any): BookItem {
        const props = response.items[0].properties;
        
        const bookItem: BookItem = {
            published: new Date(props.datePublished[0]),
            title: props.name[0],
            ISBN: props.isbn[0],
            currentPrice: Number(props.price[0].replace(/\s/g, '').match(/[0-9]+/g)[0]),
            image: props.image[0],
            author: {
                name: props.author[0].properties.name[0],
                url: props.author[0].properties.url[0],
            }
        }

        return bookItem;
    }
}