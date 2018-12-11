export interface BookItem {
    ISBN: string;
    title: string;
    published: Date;
    author: BookItemAuthor;
    currentPrice: number;
    image: string;
}

export interface BookItemAuthor {
    name: string;
    url: string;
}

export const mockBookItem = {
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
