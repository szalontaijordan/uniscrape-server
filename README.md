# Uniscrape REST API

This is the backend of the Uniscrape application, implemented in Express.

## Book API in UniScrape: `/api/book`

Wwhere not otherwise stated a `DepositoryBookItem` entity looks like the following:

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

### `/depository`

#### `GET /sections`
Returns the title available sections on the home page of BookDepository.


```
{
    sections: Array<string>
}
```

#### `GET /section/:sectionName`

The `:sectionName` param should be the one of the names that `/sections` returns. If not this will resolve as a bad request.

Returns an array of `DepositoryBookItem`s of the section.

```
{
    books: Array<DepositoryBookItem>
}
```

#### `GET /search/:searchTerm`
#### `GET /search/:searchTerm/:page`

The `:page` param specifies the page to be returned. (1, ...)

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

Returns the results of a search on BookDepository, an array of `DepositoryBookItem`s.

```
{
    books: Array<DepositoryBookItem>
}
```

#### `POST /auth`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

TODO

### `/ebay`

#### `/search/:searchTerm`
#### `/search/:searchTerm/:page`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

The `:page` param specifies the page to be returned. (1, ...)

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

Returns the results of a search on Ebay, an array of `EbayBookItem`s.

```
{
    books: Array<EbayBookItem>
}
```

### `/amazon`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

#### `/search/:searchTerm`
#### `/search/:searchTerm/:page`

The `:page` param specifies the page to be returned. (1, ...)

As a side effect, the searchTerm will be stored in the database among the last 10 searches, and will be suggested (this will be shared among all searches).

Returns the results of a search on the Amazon site, an array of `AmazonBookItem`s.

```
{
    books: Array<AmazonBookItem>
}
```
