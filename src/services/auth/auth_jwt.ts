import axios from 'axios';
import { getTokenFromStore, saveTokenToStore } from './tokenStore';
import { randomUUID } from 'crypto';
import { AUTH_URL } from '../../constants/url';

export async function authJwt(context: Record<string, any>): Promise<Record<string, any>> {
    // Check if a valid token exists in the store
    const cachedToken = getTokenFromStore();
    if (cachedToken) {
        console.log('Using cached JWT token');
        return { jwt_token: cachedToken };
    }

    // Fetch a new token if none exists or if it's expired
        const response = await axios.get(AUTH_URL, {
            headers: {
                'trace-id': context['trace-id'],
                Authorization: `Basic ${process.env.usr_pswd_io!}`,
            },
        });

        const jwt_token = response.data; // Assuming the token is in `response.data.token`

        // Save the token and its expiration time to the store
        saveTokenToStore(jwt_token);

        console.log(`Fetched new JWT token`);
        return { jwt_token: jwt_token };
}