import axios from 'axios';
import { randomUUID } from 'crypto';

export async function addBillingAccount(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.post(`${context.baseUrl}/v1/billing/accounts`, {
            customer_party_id: context.customer_party_id,
            account_type: 'RETAIL',
            payment_reference: {
                value: randomUUID(),
                type: 'USResidential',
                recurring_payment_method_type: 'Visa',
            },
            tax_code: context.tax_code,
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        // Log billing account number
        console.log('Billing Account Number:', responseJson.account_number);

        return { billing_account_id: responseJson.account_number };
}