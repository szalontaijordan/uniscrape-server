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

## Book API in UniScrape: `/api`

| Method           | Endpoint                                      | Class method                                            |
|------------------|-----------------------------------------------|---------------------------------------------------------|
| GET              | /api/book/all/searchHistory                   | AllController.getRecentSearches()                       |
| GET              | /api/book/all/auth                            | AllController.getAuth()                                 |
| GET              | /api/book/amazon/search/:searchTerm/:page     | AmazonController.getAmazonSearchResults()               |
| GET              | /api/book/amazon/search/:searchTerm           | AmazonController.getAmazonSearchResults()               |
| GET              | /api/book/depository/sections                 | DepositoryController.getSections()                      |
| GET              | /api/book/depository/section/:sectionName     | DepositoryController.getBookItemsOfSection()            |
| GET              | /api/book/depository/search/:searchTerm/:page | DepositoryController.getDepositorySearchResults()       |
| GET              | /api/book/depository/search/:searchTerm       | DepositoryController.getDepositorySearchResults()       |
| POST             | /api/book/depository/auth/login               | DepositoryController.postLoginToDepository()            |
| POST             | /api/book/depository/auth/logout              | DepositoryController.postLogoutFromDepository()         |
| GET              | /api/book/depository/wishlist                 | DepositoryController.getDepositoryWishlist()            |
| GET              | /api/book/ebay/search/:searchTerm/:page       | EbayController.getEbaySearchResults()                   |
| GET              | /api/book/ebay/search/:searchTerm             | EbayController.getEbaySearchResults()                   |
| GET              | /api/internal/wishlist                        | WishlistController.getBookItemsOnInternalWishlist()     |
| GET              | /api/internal/wishlist/:ISBN                  | WishlistController.getBookItemFromInternalWishlist()    |
| POST             | /api/internal/wishlist                        | WishlistController.postBookItemToInternalWishlist()     |
| DELETE           | /api/internal/wishlist/:ISBN                  | WishlistController.deleteBookItemFromInternalWishlist() |
