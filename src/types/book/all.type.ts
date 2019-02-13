export interface SearchHistory {
    recentSearches: Array<{
        term: string;
        date: Date;
    }>;
}

export interface TrueMessage {
    message: 'true';
}

export interface CommonBookItem {
    ISBN: string;
    title: string;
    image: string;
    author: {
        name: string;
        url?: string;
    };
    price: number;
    publicationDate: Date;
    url: string;
}

export interface CommonBookList {
    books: Array<CommonBookItem>;
}
