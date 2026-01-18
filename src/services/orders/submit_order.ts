import axios from 'axios';

export async function submitOrder(context: Record<string, any>): Promise<Record<string, any> | undefined> {
        const response = await axios.post(`${context.baseUrl}/v1/retail/orders`, {
            customer_party_id: context.customer_party_id,
            sales_agreement_id: context.sales_agreement_id,
            attributes: [
                {
                    name: 'seller-agent-id',
                    value: '12345',
                },
            ],
            order_lines: [
                {
                    billing_account_id: context.billing_account_id,
                    fulfillment_agreement_id: "6b52034d-a5f6-47a7-8c56-b2319688205e",
                    // fulfillment_agreement_id: context.fulfillment_agreement_id,
                    payment_transaction_id: context.payment_transaction_id,
                    service_location: {
                        address: {
                            address_lines: [context.address_lines],
                            municipality: context.municipality,
                            region: context.region,
                            postal_code: context.postal_code,
                            country_code: context.country_code,
                        },
                        coordinates: {
                            latitude: context.latitude,
                            longitude: context.longitude,
                        },
                    },
                    shopping_cart_id: context.cart_id,
                    tax_jurisdiction: {
                        tax_code_type: context.tax_code.type,
                        tax_code_value: context.tax_code.value,
                    },
                    work_order_information: {
                        appointment: {
                            start_time: context.appointment_start_time,
                            end_time: context.appointment_end_time,
                        },
                    },
                },
            ],
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        // Save order ID in the context
        context.order_id = responseJson.id;

        return { order_id: responseJson.id };
}