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

## Documentation:

Please find the documentation at
```
http://localhost:8080/doc
```
or
```
https://www.uniscrape.herokuapp.com/doc
```

### REST endpoints

| Method           | Endpoint                                      | Class method                                            |
|------------------|-----------------------------------------------|---------------------------------------------------------|
| GET              | /api/book/all/searchHistory                   | AllController.getRecentSearches()                       |
| GET              | /api/book/all/auth                            | AllController.getAuth()                                 |
| GET              | /api/book/amazon/search/:searchTerm/:page     | AmazonController.getAmazonSearchResults()               |
| GET              | /api/book/amazon/search/:searchTerm           | AmazonController.getAmazonSearchResults()               |
| GET              | /api/book/depository/item/:ISBN               | DepositoryController.getBookByISBN()                    |
| GET              | /api/book/depository/sections                 | DepositoryController.getSections()                      |
| GET              | /api/book/depository/section/:sectionName     | DepositoryController.getBookItemsOfSection()            |
| GET              | /api/book/depository/search/:searchTerm/:page | DepositoryController.getDepositorySearchResults()       |
| GET              | /api/book/depository/search/:searchTerm       | DepositoryController.getDepositorySearchResults()       |
| GET              | /api/book/depository/auth                     | DepositoryController.getDepositoryAuth()                |
| POST             | /api/book/depository/auth/login               | DepositoryController.postLoginToDepository()            |
| POST             | /api/book/depository/auth/logout              | DepositoryController.postLogoutFromDepository()         |
| GET              | /api/book/depository/wishlist                 | DepositoryController.getDepositoryWishlist()            |
| GET              | /api/book/ebay/search/:searchTerm/:page       | EbayController.getEbaySearchResults()                   |
| GET              | /api/book/ebay/search/:searchTerm             | EbayController.getEbaySearchResults()                   |
| GET              | /api/internal/watcher/subscription            | WatcherController.getWatcherSubscription()              |
| POST             | /api/internal/watcher/subscription            | WatcherController.postWatcherSubscription()             |
| DELETE           | /api/internal/watcher/subscription/:email     | WatcherController.deleteWatcherSubscription()           |
| GET              | /api/internal/wishlist                        | WishlistController.getBookItemsOnInternalWishlist()     |
| GET              | /api/internal/wishlist/:ISBN                  | WishlistController.getBookItemFromInternalWishlist()    |
| POST             | /api/internal/wishlist                        | WishlistController.postBookItemToInternalWishlist()     |
| DELETE           | /api/internal/wishlist/:ISBN                  | WishlistController.deleteBookItemFromInternalWishlist() |
