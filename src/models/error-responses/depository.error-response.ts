import { InternalServerError, Unauthorized } from 'ts-httpexceptions';

import { DepositroyException } from '../exceptions/book.exceptions';
import { ErrorResponse } from './error-response';

export class DepositoryCommonErrorResponse extends InternalServerError implements ErrorResponse {

    constructor(public exception: DepositroyException) {
        super(exception.message);
    }
}

export class DepositoryAuthErrorResponse extends Unauthorized implements ErrorResponse {

    constructor(public exception: DepositroyException) {
        super(exception.message);
    }
}