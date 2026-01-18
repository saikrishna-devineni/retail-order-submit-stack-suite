import axios from 'axios';
import { buildQueryString } from '../../utils/queryString';

export async function verifyLocationByCoordinates(context: Record<string, any>): Promise<Record<string, any>> {
        // Build the query string using the utility function
        const queryString = buildQueryString({
            latitude: context.latitude,
            longitude: context.longitude,
        });

        const response = await axios.get(`${context.baseUrl}/v1/geo/coordinates?${queryString}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        console.log('Verified location:', JSON.stringify(responseJson));

        return responseJson;
}