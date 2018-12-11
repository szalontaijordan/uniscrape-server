# Uniscrape REST API

This is the backend of the Uniscrape application, implemented in Express.

## Book API in UniScrape: `/api/book`

Wwhere not otherwise stated a `BookItem` entity looks like the following:

```
{
    ISBN: string,
    title: string,
    published: Date,
    author: {
        name: string,
        url: string
    },
    currentPrice: number,
    image: string
}
```

The `EbayBookItem` and the `AmazonBookItem` entites are not defined yet.

### `GET /sections`

Returns the title available sections on the home page of BookDepository.


```
{
    sections: Array<string>
}
```

### `GET /section/:sectionName`

The `:sectionName` param should be the one of the names that `/sections` returns. If not this will resolve as a bad request.

Returns an array of `BookItem`s of the section.

```
{
    books: Array<BookItem>
}
```

### `GET /search/depository/:searchTerm`

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

Returns the results of a search on BookDepository, an array of `BookItem`s.

```
{
    books: Array<BookItem>
}
```

#### Filtering

TODO

### `GET /search/ebay/:searchTerm`

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

Returns the results of a search on Ebay, an array of `BookItem`s.

```
{
    books: Array<EbayBookItem>
}
```

#### Filtering

TODO

### `GET /search/amazon/:searchTerm`

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

Returns the results of a search on the Amazon site, an array of `BookItem`s.

```
{
    books: Array<AmazonBookItem>
}
```

#### Filtering

TODO
