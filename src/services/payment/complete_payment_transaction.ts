import axios from 'axios';

export async function completePaymentTransaction(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.post(
            `${context.paymentBaseUrl}/v1/payment-pci/transactions/${context.payment_transaction_id}?save_payment_info=true&use_as_default=false&use_for_recurring_payment=true&use_for_both_payments=true`,
            {
                full_name: 'FirstName LastName',
                card_number: '370000000000002',
                expiration_month: '03',
                expiration_year: '2030',
                security_code: '7373',
                billingAddress: {
                    postalCode: context.postal_code,
                    country: 'US',
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

        console.log('Payment Transaction Completed:', responseJson);

        return { payment_status: responseJson.status_code };
}