import { InternalServerError } from 'ts-httpexceptions';

import { DepositroyException } from '../exceptions/book.exceptions';
import { ErrorResponse } from './error-response';

export class DepositoryErrorResponse extends InternalServerError implements ErrorResponse {

    constructor(public exception: DepositroyException) {
        super(exception.message);
    }
}
