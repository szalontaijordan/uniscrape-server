import { InternalServerError, NotFound } from 'ts-httpexceptions';

import { EbayException } from '../exceptions/book.exceptions';
import { ErrorResponse } from './error-response';

export class EbayCommonErrorResponse extends InternalServerError implements ErrorResponse {

    constructor(public exception: EbayException) {
        super(exception.message);
    }
}

export class EbayEmptyResultsErrorResponse extends NotFound implements ErrorResponse {

    constructor(public exception: EbayException) {
        super(exception.message);
    }
}
