import axios from 'axios';

export async function extendVoiceAddons(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.patch(`${context.baseUrl}/v1/sales/cart/items`, {
            product_type_id: context.voice_add_on_product_type_id,
            shopping_cart_id: context.cart_id,
            product_candidate_id: context.root_product_candidate_id,
            voice: {
                id: context['trace-id'],
                telephone_number: '11111111111',
                first_name: 'John',
                last_name: 'Doe',
                caller_id_name: 'John Doe',
                block_caller_id: 'false',
                directory_list_type: 'LIST_NOT_PUBLISH',
                number_type: 'NEW',
                emergency_address: {
                    country_code: context.country_code,
                    address_lines: [context.address_lines],
                    postal_code: context.postal_code,
                    municipality: context.municipality,
                    region: context.region,
                },
                publish_directory_list_address: 'false',
                EMERGENCY_CONTACT_NAME: '',
                TEMPORARY_TN_ID: '',
                BILLING_TELEPHONE_NUMBER: '',
                PORTING_AUTHORIZED_NAME: '',
                PORTING_WIRE_TYPE:'',
                WIRELESS_ACCOUNT_NUMBER:'',
                WIRELESS_PIN:'',
                DISCONNECT_INTERNET_SERVICE:'',
                DISCONNECT_TELEVISION_SERVICE: ''
            },
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        console.log('Voice add-ons extended:', responseJson);

        return responseJson;
}