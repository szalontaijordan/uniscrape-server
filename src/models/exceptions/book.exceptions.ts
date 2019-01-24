import { CustomException } from './exception';

export class BookDepositoryDOMChangedException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class BookDepositoryAuthException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export type DepositroyException =
    BookDepositoryDOMChangedException |
    BookDepositoryAuthException;
