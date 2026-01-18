import axios from 'axios';

export async function finalizeShoppingCart(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.post(`${context.baseUrl}/v1/sales/cart/${context.cart_id}`, {
            op: 'ADD',
            path: 'acceptShoppingCart',
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        console.log('Shopping cart finalized', responseJson);

        return {};
}