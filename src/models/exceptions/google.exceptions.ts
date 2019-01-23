import { CustomException } from './exception';

export class GoogleIdTokenInvalidException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class GoogleTokenMissingException extends CustomException {

    constructor(public message: string) {
        super();
    }
}

export type GoogleException =
    GoogleIdTokenInvalidException |
    GoogleTokenMissingException;
