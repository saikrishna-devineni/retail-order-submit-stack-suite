import axios from 'axios';

export async function extendRootAddons(context: Record<string, any>): Promise<Record<string, any> | undefined> {
        const response = await axios.patch(`${context.baseUrl}/v1/sales/cart/items`, {
            product_type_id: context.root_add_on_product_type_id,
            shopping_cart_id: context.cart_id,
            product_candidate_id: context.root_product_candidate_id,
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        console.log('Root add-ons extended:', responseJson);

        return responseJson;
}