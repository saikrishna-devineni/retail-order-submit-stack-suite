import axios from 'axios';
import { buildQueryString } from '../../utils/queryString';

export async function getAddons(context: Record<string, any>): Promise<Record<string, any>> {
        const queryString = buildQueryString({
            root_product_type_id: context.root_product_type_id,
            sales_agreement_id: context.sales_agreement_id,
            address_lines: context.address_lines,
            municipality: context.municipality,
            region: context.region,
            postal_code: context.postal_code,
            country_code: context.country_code,
            latitude: context.latitude,
            longitude: context.longitude,
        });

        const response = await axios.get(`${context.baseUrl}/v1/sales/products/add-ons?${queryString}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        console.log('Get Add-ons Response:', JSON.stringify(responseJson.product_types.map((pt: any) => ({ id: pt.id, description: pt.description, kind: pt.kind })), null, 2));

        // Extract voice add-on product type ID
        for (let add_on of responseJson.product_types) {
            if (add_on.kind === 'bep.ofm.product-types.satellite-internet-add-on') {
                context.voice_add_on_product_type_id = add_on.id;
                break;
            }
        }

        return { voice_add_on_product_type_id: context.voice_add_on_product_type_id };
}