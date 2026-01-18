import axios from 'axios';

export async function showCustomer(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.get(`${context.baseUrl}/v1/customer/customers/${context.customer_party_id}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        console.log('Party Id from get customer details:', responseJson.id);

        return {};
}