export interface DepositoryBookItem {
    ISBN: string;
    title: string;
    published: Date;
    author?: DepositoryBookItemAuthor;
    currentPrice?: number;
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

export const mockDepositoryBookItem = {
    ISBN: 'ISBN000000',
    title: 'Mock Book Item',
    published: new Date(),
    author: {
        name: 'Mock János',
        url: 'javascript:void(0)'
    },
    currentPrice: 0,
    image: 'javascript:void(0)'
}
