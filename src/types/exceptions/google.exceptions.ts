import { GoogleException } from './exceptions';

export class GoogleIdTokenInvalidException extends GoogleException {
    
    constructor(message: string) {
        super(message);
    }
}

export class GoogleIdTokenMissingException extends GoogleException {

    constructor(message: string) {
        super(message);
    }
}
