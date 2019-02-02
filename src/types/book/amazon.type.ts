export interface AmazonBookItem {
    title: string;
    url: string;
    category: string;
    price: string;
    image: string;
}

export interface AmazonBookList {
    books: Array<AmazonBookItem>;
}
