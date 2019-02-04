import { Service, OnInit } from '@tsed/common';
import { DepositoryBookItem, DepositoryWishlistItem } from '../../types/book/depository.type';
import { CommonBookItem } from '../../types/book/all.type';
import { EbayKeywordsResult } from '../../types/book/ebay.type';
import { AmazonBookItem } from '../../types/book/amazon.type';

@Service()
export class BookTransformerService implements OnInit {
    
    private static USD_TO_HUF = 270;

    constructor() {
    }
    
    public $onInit(): void {
    }

    public transformDepositoryToCommon(book: DepositoryBookItem): CommonBookItem {
        const { ISBN, title, author, image, currentPrice, published, linkToBook } = book;

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

    public transformDepositoryWishlistToCommon(book: DepositoryWishlistItem): CommonBookItem {
        const { url, title, author, image, currentPrice } = book;

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
