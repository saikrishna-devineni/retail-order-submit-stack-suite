import axios from 'axios';
import { buildQueryString } from '../../utils/queryString';

export async function getTaxCodes(context: Record<string, any>): Promise<Record<string, any>> {

        // Build the query string using the utility function
        const queryString = buildQueryString(
            {
                region: context.region,
                address_line: context.address_lines,
                country_code: context.country_code,
                postal_code: context.postal_code,
                municipality: context.municipality,
            }
        );

        const response = await axios.get(`${context.baseUrl}/v1/billing/tax-codes?${queryString}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        // Save tax code in the context
        context.tax_code = responseJson;

        console.log('Retrieved Tax Codes:', JSON.stringify(responseJson, null, 2));

        return { tax_code: responseJson };

}