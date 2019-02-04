import { Service, OnInit } from '@tsed/common';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../../config/vars';

import { GoogleIdTokenInvalidException, GoogleIdTokenMissingException } from '../../types/exceptions/google.exceptions';
import { GOOGLE_ID_TOKEN_MISSING_MESSAGE, GOOGLE_ID_TOKEN_INVALID_MESSAGE } from '../../types/exceptions/exceptions';

@Service()
export class GoogleService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
    }

    public async validateGoogleIdToken(authHeader: string): Promise<string> {
        if (!authHeader || authHeader.indexOf('Bearer') !== 0) {
            throw new GoogleIdTokenMissingException(GOOGLE_ID_TOKEN_MISSING_MESSAGE);
        }

        try {
            const token = authHeader.split('Bearer ')[1];
        
            const CLIENT_ID = config.google.web.client_id;
            const client = new OAuth2Client(token);
    
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });

            return ticket.getUserId();
        } catch (err) {
            throw new GoogleIdTokenInvalidException(GOOGLE_ID_TOKEN_INVALID_MESSAGE);
        }
    }
}
