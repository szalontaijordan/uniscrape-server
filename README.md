# Uniscrape REST API

This is the backend of the Uniscrape application, implemented in Express.

## Install & Run in dev mode

Make sure, you have the a recent version of Node.js and NPM.

First, install the dependencies:

```
$ npm install
```

Then run in dev mode:

```
$ npm run dev
```

This is only an API, so you'll have to use something like Postman, Curl to make call againts it.

Example call:

```
$ curl "http://localhost:8080/api/book/depository/sections"
```

## Book API in UniScrape: `/api/book`

Where not otherwise stated a `DepositoryBookItem` entity looks like the following:

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


... and `DepositoryWishlistItem` looks like the following:

```
{
    title: string,
    author: DepositoryBookItemAuthor,
    currentPrice: number,
    image: string,
    url: string
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

#### `POST /auth/login`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

The request body should contain the following JSON:

```
{
    "email": "<your depository email>",
    "password": "<your depository password>"
}

```

#### `POST /auth/logout`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

#### `GET /wishlist`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

You must first log in with `/auth/login` to access the wishlist.

Returns the wishlist on The Bookdepository, an array of `DepositoryWishlistItem`s.

```
{
    books: Array<DepositoryWishlistItem>
}
```

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

### `/internal`

#### `GET /wishlist`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

Returns a list of `DepositoryBookItem`s, on your internal wishlist.

```
{
    books: Array<DepositoryBookItem>
}
```

#### `POST /wishlist`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

Adds a new `DepositoryBookItem` to your internal wishlist.

The request body should contain the `DepositoryBookItem` to add.

Returns the newly added item.

### `/all`

#### `/recent`

A header must be specified with the request: `Authorization: Bearer <Google Auth Token>`

Returns a list of queries you entered in the different platforms (Amazon, Ebay, Bookdepository)

```
{
    recentSearches: Array<string>
}
```
