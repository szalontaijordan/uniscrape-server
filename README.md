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

For the UI please visit: https://github.com/szalontaijordan/uniscrape-ui

## Documentation:

Please find the documentation at
```
http://localhost:8080/doc
```
or
```
https://uniscrape.herokuapp.com/doc
```

### REST endpoints

| Method           | Endpoint                                      | Class method                                            |
|------------------|------------------------------|-------------------|
| GET              | /api/book/all/searchHistory                   |[AllController.getRecentSearches()](https://uniscrape.herokuapp.com/doc/allcontroller.html#getrecentsearches)|
| GET              | /api/book/all/auth                            |[AllController.getAuth()](https://uniscrape.herokuapp.com/doc/allcontroller.html#getauth)|
| GET              | /api/book/amazon/search/:searchTerm/:page     |[AmazonController.getAmazonSearchResults()](https://uniscrape.herokuapp.com/doc/amazoncontroller.html#getamazonsearchresults)|
| GET              | /api/book/amazon/search/:searchTerm           |[AmazonController.getAmazonSearchResults()](https://uniscrape.herokuapp.com/doc/amazoncontroller.html#getamazonsearchresults)|
| GET              | /api/book/depository/item/:ISBN               |[DepositoryController.getBookByISBN()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getbookbyisbn)|
| GET              | /api/book/depository/sections                 |[DepositoryController.getSections()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getsections)|
| GET              | /api/book/depository/section/:sectionName     |[DepositoryController.getBookItemsOfSection()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getbookitemsofsection)|
| GET              | /api/book/depository/search/:searchTerm/:page |[DepositoryController.getDepositorySearchResults()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getdepositorysearchresults)|
| GET              | /api/book/depository/search/:searchTerm       |[DepositoryController.getDepositorySearchResults()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getdepositorysearchresults)|
| GET              | /api/book/depository/auth                     |[DepositoryController.getDepositoryAuth()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getdepositoryauth)|
| POST             | /api/book/depository/auth/login               |[DepositoryController.postLoginToDepository()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#postlogintodepository)|
| POST             | /api/book/depository/auth/logout              |[DepositoryController.postLogoutFromDepository()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#postlogoutfromdepository)|
| GET              | /api/book/depository/wishlist                 |[DepositoryController.getDepositoryWishlist()](https://uniscrape.herokuapp.com/doc/depositorycontroller.html#getdepositorywishlist)|
| GET              | /api/book/ebay/search/:searchTerm/:page       |[EbayController.getEbaySearchResults()](https://uniscrape.herokuapp.com/doc/ebaycontroller.html#getebaysearchresults)|
| GET              | /api/book/ebay/search/:searchTerm             |[EbayController.getEbaySearchResults()](https://uniscrape.herokuapp.com/doc/ebaycontroller.html#getebaysearchresults)|
| GET              | /api/internal/watcher/subscription            |[WatcherController.getWatcherSubscription()](https://uniscrape.herokuapp.com/doc/watchercontroller.html#getwatchersubscription)|
| POST             | /api/internal/watcher/subscription            |[WatcherController.postWatcherSubscription()](https://uniscrape.herokuapp.com/doc/watchercontroller.html#postwatchersubscription)|
| DELETE           | /api/internal/watcher/subscription/:email     |[WatcherController.deleteWatcherSubscription()](https://uniscrape.herokuapp.com/doc/watchercontroller.html#deletewatchersubscription)|
| GET              | /api/internal/wishlist                        |[WishlistController.getBookItemsOnInternalWishlist()](https://uniscrape.herokuapp.com/doc/wishlistcontroller.html#getbookitemsoninternalwishlist)|
| GET              | /api/internal/wishlist/:ISBN                  |[WishlistController.getBookItemFromInternalWishlist()](https://uniscrape.herokuapp.com/doc/wishlistcontroller.html#getbookitemfrominternalwishlist)|
| POST             | /api/internal/wishlist                        |[WishlistController.postBookItemToInternalWishlist()](https://uniscrape.herokuapp.com/doc/wishlistcontroller.html#postbookitemtointernalwishlist)|
| DELETE           | /api/internal/wishlist/:ISBN                  |[WishlistController.deleteBookItemFromInternalWishlist()](https://uniscrape.herokuapp.com/doc/wishlistcontroller.html#deletebookitemfrominternalwishlist)|
