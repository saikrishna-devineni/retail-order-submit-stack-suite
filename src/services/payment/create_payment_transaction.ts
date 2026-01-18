import axios from 'axios';

export async function createPaymentTransaction(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.post(
            `${context.baseUrl}/v1/payment/transactions`,
            {
                transaction_type: 'AUTHORIZE',
                customer_id: context.customer_party_id,
                billing_account_number: context.billing_account_id,
                partner_short_name: 'ISG',
                customer_email: 'john.doe@example.com',
                money: {
                    value: context?.payment_amount || 60, // Default to 60 if payment_amount is not set
                    currency_code: 'USD',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${context.jwt_token}`,
                    'trace-id': context['trace-id'],
                    'Content-Type': 'application/json',
                },
            }
        );

        const responseJson = response.data;

        // Save the payment transaction ID in the context
        const payment_transaction_id = responseJson.payment_transaction_id;

        console.log("Payment Transaction Created:", responseJson);

        return { payment_transaction_id: payment_transaction_id };
}