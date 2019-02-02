import { Unauthorized, BadRequest } from 'ts-httpexceptions';

import { GoogleException } from '../exceptions/google.exceptions';
import { ErrorResponse } from './error-response';

export class GoogleAuthErrorResponse extends Unauthorized implements ErrorResponse {

    constructor(public exception: GoogleException) {
        super(exception.message);
    }
}

export class GoogleCommonErrorResponse extends BadRequest implements ErrorResponse {

    constructor(public exception: GoogleException) {
        super(exception.message);
    }
}
