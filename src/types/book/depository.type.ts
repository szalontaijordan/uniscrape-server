export interface DepositoryBookItem {
    ISBN: string;
    title: string;
    published: string;
    author?: DepositoryBookItemAuthor;
    currentPrice?: number;
    linkToBook?: string;
    image: string;
}

export interface DepositoryWishlistItem {
    title: string;
    author: DepositoryBookItemAuthor;
    currentPrice: number;
    image: string;
    url: string;
}

export interface DepositoryBookItemAuthor {
    name: string;
    url: string;
}

export interface DepositorySectionList {
    sections: Array<string>;
}

export interface DepositoryBookList {
    books: Array<DepositoryBookItem>;
}

export interface DepositoryAuthMessage {
    auth: string;
}

export interface DepositoryWishlist {
    books: Array<DepositoryWishlistItem>;
}

export const mockDepositoryBookItem = {
    ISBN: 'ISBN000000',
    title: 'Mock Book Item',
    published: new Date().toJSON,
    author: {
        name: 'Mock János',
        url: 'javascript:void(0)'
    },
    currentPrice: 0,
    image: 'javascript:void(0)'
}
