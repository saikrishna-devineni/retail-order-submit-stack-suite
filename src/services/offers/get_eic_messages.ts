import axios from 'axios';

export async function getEICMessages(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.get(`${context.baseUrl}/v1/sales/cart/eic-messages/${context.cart_id}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        context['eic_root_candidate_ids']=[];
        console.log('EIC is needed for the following products:');
        // Extract root product candidate ID
        for (let product of responseJson) {
            context['eic_root_candidate_ids'].push(product.product_candidate_id);
            console.log(`Product Candidate ID: ${product.product_candidate_id}, Product Name: ${product.product_name}, Product Type ID: ${product.product_type_id}`);
        }

        return {
            eic_root_candidate_ids: context.eic_root_candidate_ids,
        };
}