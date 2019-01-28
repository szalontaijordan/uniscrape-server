import { InternalServerError, NotFound } from 'ts-httpexceptions';

import { AmazonException } from '../exceptions/book.exceptions';
import { ErrorResponse } from './error-response';

export class AmazonCommonErrorResponse extends InternalServerError implements ErrorResponse {

    constructor(public exception: AmazonException) {
        super(exception.message);
    }
}

export class AmazonEmptyResultsErrorResponse extends NotFound implements ErrorResponse {

    constructor(public exception: AmazonException) {
        super(exception.message);
    }
}
