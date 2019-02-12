export const AMAZON_EMPTY_RESULTS_MESSAGE = 'The list of the results is empty';
export const AMAZON_DOM_CHANGED_MESSAGE = 'The current selectors were not able to find any books';

export const DEPOSITORY_DOM_CHANGED_MESSAGE = 'Failed to scrape sections with the current CSS selector';
export const DEPOSITORY_EMPTY_RESULTS_MESSAGE = 'The list of the books scraped by the current selector is empty';
export const DEPOSITORY_SUCCESSFUL_LOGIN_MESSAGE = 'Successful login with given Google ID';
export const DEPOSITORY_DOM_CHANGED_LOGIN_NOT_FOUND_MESSAGE = 'Currrent selectors were unable to find the login form';
export const DEPOSITORY_DOM_CHANGED_AUTO_LOGIN_FAIL_MESSAGE = 'Automated headless login failed';
export const DEPOSITORY_AUTH_INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
export const DEPOSITORY_AUTH_NOT_LOGGED_IN_MESSAGE = 'You are not logged in';
export const DEPOSITORY_AUTH_CANNOT_LOG_OUT_IF_NOT_LOGGED_IN_MESSAGE = 'You cannot log out, if you are not logged in';
export const DEPOSTIORY_SUCCESSFUL_LOGOUT_MESSAGE = 'Successful logout with the given Google ID';

export const EBAY_API_ERROR_MESSAGE = 'There was a problem with the Ebay API call';
export const EBAY_EMPTY_RESULTS_MESSAGE = 'The result list is empty';

export const GOOGLE_ID_TOKEN_MISSING_MESSAGE = 'You must provide a valid Google ID token';
export const GOOGLE_ID_TOKEN_INVALID_MESSAGE = 'The provided Google ID Token is invalid';

export const BOOK_ITEM_ALREADY_ON_WISHLIST_MESSAGE = 'The selected book is already on the wishlist';

export class CustomException {

    constructor(...args: Array<any>) {
        Error.apply(this, ...args);
    }
}

export class DepositoryException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class AmazonException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class EbayException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class GoogleException extends CustomException {
    
    constructor(public message: string) {
        super();
    }
}

export class WishlistException extends CustomException {

    constructor(public message: string) {
        super();
    }
}
