import axios from 'axios';
import { buildQueryString } from '../../utils/queryString';

export async function scrubLocation(context: Record<string, any>): Promise<Record<string, any>> {
        // Build the query string using the utility function
        const queryString = buildQueryString({
            address_lines: context.address_lines,
            municipality: context?.municipality,
            region: context?.region,
            postal_code: context.postal_code,
            country_code: context?.country_code,
        });

        const response = await axios.get(`${context.baseUrl}/v1/geo/addresses?${queryString}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        // Log the response for debugging
        console.log('Scrub Location Response:', JSON.stringify(responseJson.addresses?.[0]));

        // Extract address details
        const locationDetails = {
            address_lines: responseJson.addresses[0].location.address.address_lines.join(', '),
            house_number: responseJson.addresses[0].location.address.house_number,
            street_name: responseJson.addresses[0].location.address.street_name,
            municipality: responseJson.addresses[0].location.address.municipality,
            region: responseJson.addresses[0].location.address.region,
            postal_code: responseJson.addresses[0].location.address.postal_code,
            country_code: responseJson.addresses[0].location.address.country_code,
            latitude: responseJson.addresses[0].location.coordinates.latitude,
            longitude: responseJson.addresses[0].location.coordinates.longitude,
            accuracy_level: responseJson.addresses[0].accuracy_level,
            process_status: responseJson.addresses[0].process_status,
            recommendation: responseJson.addresses[0].recommendation,
        };

        return locationDetails;

}