import { CustomException } from './exception';

export class BookDepositoryDOMChangedException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class BookDepositoryEmptyResultsException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export class BookDepositoryAuthException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class EbayAPIException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export class EbayEmptyResultsException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export class AmazonDOMChangedException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export class AmazonEmptyResultsException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export type DepositroyException =
    BookDepositoryDOMChangedException |
    BookDepositoryEmptyResultsException |
    BookDepositoryAuthException;

export type EbayException =
    EbayAPIException |
    EbayEmptyResultsException;

export type AmazonException =
    AmazonDOMChangedException |
    AmazonEmptyResultsException;
    