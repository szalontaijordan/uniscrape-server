import { AmazonException, DepositoryException, EbayException, WishlistException } from './exceptions';

export class DepositoryDOMChangedException extends DepositoryException {
    
    constructor(message: string) {
        super(message);
    }
}

export class DepositoryEmptyResultsException extends DepositoryException {

    constructor(message: string) {
        super(message);
    }
}

export class DepositoryAuthException extends DepositoryException {
    
    constructor(message: string) {
        super(message);
    }
}

export class EbayAPIException extends EbayException {

    constructor(message: string) {
        super(message);
    }
}

export class EbayEmptyResultsException extends EbayException {

    constructor(message: string) {
        super(message);
    }
}

export class AmazonDOMChangedException extends AmazonException {

    constructor(message: string) {
        super(message);
    }
}

export class AmazonEmptyResultsException extends AmazonException {

    constructor(message: string) {
        super(message);
    }
}

export class BookItemAlreadyOnWishlistException extends WishlistException {

    constructor(message: string) {
        super(message);
    }
}

export class BookItemIsNotOnWishlistException extends WishlistException {

    constructor(message: string) {
        super(message);
    }
}   
