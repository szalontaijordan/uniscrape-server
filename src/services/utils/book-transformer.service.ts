import { Service, OnInit } from '@tsed/common';
import { DepositoryBookItem, DepositoryWishlistItem } from '../../types/book/depository.type';
import { CommonBookItem } from '../../types/book/all.type';
import { EbayKeywordsResult } from '../../types/book/ebay.type';
import { AmazonBookItem } from '../../types/book/amazon.type';

/**
 * Utility service class for transforming between book items.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class BookTransformerService implements OnInit {
    
    private static USD_TO_HUF = 270;

    constructor() {
    }
    
    public $onInit(): void {
    }

    /**
     * Returns a book from the given Book Depository book.
     * 
     * @param book the Book Depository book
     */
    public transformDepositoryToCommon(book: DepositoryBookItem): CommonBookItem {
        let { ISBN, title, author, image, currentPrice, published, linkToBook } = book;

        if (!currentPrice) {
            currentPrice = 999999;
        }

        if (!author) {
            author = {
                name: 'BOOKDEPOSITORY-UNKNOWN-AUTHOR',
                url: 'javascript:void(0)',
            }    
        }

        if (!linkToBook) {
            linkToBook = 'javascript:void(0)'
        }

        return {
            ISBN,
            title,
            author: {
                name: author.name,
                url: author.url
            },
            image,
            price: currentPrice,
            publicationDate: new Date(published),
            url: linkToBook
        };
    }

    /**
     * Returns a book from the given Ebay book.
     * 
     * @param book the Ebay book
     */
    public transformEbayToCommon(book: EbayKeywordsResult): CommonBookItem {
        return {
            ISBN: 'EBAY-ITEM-ID' + book.itemId[0],
            title: book.title[0],
            author: {
                name: 'EBAY-UNKNOWN-AUTHOR',
                url: 'javascript:void(0)'
            },
            image: book.galleryURL[0],
            price: Number(book.sellingStatus[0].convertedCurrentPrice[0].__value__) * BookTransformerService.USD_TO_HUF,
            publicationDate: book.listingInfo[0].startTime[0],
            url: book.viewItemURL[0]
        }
    }

    /**
     * Returns a book from the given Amazon book.
     * 
     * @param book the Amazon book
     */
    public transformAmazonToCommon(book: AmazonBookItem): CommonBookItem {
        const { title, image, price, url } = book;

        return {
            ISBN: 'AMAZON-UNKNOWN-' + new Date().getTime(),
            title,
            author: {
                name: 'AMAZON-UNKNOWN-AUTHOR',
                url: 'javascript:void(0)'
            },
            image,
            publicationDate: new Date(),
            price: price.startsWith('$') ? BookTransformerService.USD_TO_HUF * Number(book.price.substring(1)) : -1,
            url
        };
    }

    /**
     * Returns a book from the given Book Depository wishlist book.
     * 
     * @param book the Book Depository wishlist book
     */
    public transformDepositoryWishlistToCommon(book: DepositoryWishlistItem): CommonBookItem {
        let { url, title, author, image, currentPrice } = book;

        if (!currentPrice) {
            currentPrice = 999999;
        }

        if (!author) {
            author = {
                name: 'BOOKDEPOSITORY-UNKNOWN-AUTHOR',
                url: 'javascript:void(0)',
            }    
        }

        return {
            ISBN: url.substring(url.lastIndexOf('/') + 1),
            title,
            author: {
                name: author.name,
                url: author.url
            },
            image,
            price: currentPrice,
            publicationDate: new Date(),
            url
        }
    }
}
