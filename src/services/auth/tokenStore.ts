import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const TOKEN_FILE_PATH = path.resolve(__dirname, '../../tokenStore.json');

export interface TokenStore {
    token: string | null;
    expiresAt: number | null;
}

const tokenStore: TokenStore = {
    token: null,
    expiresAt: null,
};

// Load the token from the file
function loadTokenFromFile(): TokenStore {
    try {
        if (fs.existsSync(TOKEN_FILE_PATH)) {
            const data = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
            return JSON.parse(data) as TokenStore;
        }
    } catch (error) {
        console.error('Error reading token file:', error);
    }
    return { token: null, expiresAt: null };
}

// Save the token to the file
function saveTokenToFile(tokenStore: TokenStore): void {
    try {
        fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenStore, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing token file:', error);
    }
}

export function getTokenFromStore(): string | null {
    const tokenStore = loadTokenFromFile();
    if (tokenStore.token && tokenStore.expiresAt && Date.now() < tokenStore.expiresAt * 1000) {
        return tokenStore.token;
    }
    return null;
}

export function saveTokenToStore(token: string): void {
    try {
        // Decode the JWT token to extract the expiration time (exp)
        const decodedToken = jwt.decode(token) as { exp?: number };
        if (!decodedToken || !decodedToken.exp) {
            throw new Error('Invalid token: Missing exp field');
        }

        const tokenStore: TokenStore = {
            token,
            expiresAt: decodedToken.exp, // Use the exact expiration time from the token
        };
        saveTokenToFile(tokenStore);
    } catch (error) {
        console.error('Error saving token to store:', error);
    }
}