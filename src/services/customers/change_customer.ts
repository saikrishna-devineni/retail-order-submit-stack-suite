import axios from 'axios';

export async function changeCustomer(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.patch(`${context.baseUrl}/v1/customer/customers/${context.customer_party_id}`, [
            {
                op: 'add',
                path: '/contact/primary/address',
                value: {
                    address_lines: [context.address_lines],
                    municipality: context.municipality,
                    region: context.region,
                    postal_code: context.postal_code,
                    country_code: context.country_code,
                },
            },
            {
                op: 'replace',
                path: '/given_name',
                value: context.given_name ?? 'Jon',
            },
            {
                op: 'replace',
                path: '/additional_external_ids',
                value: [{
                    type_name: 'dtv_account_no',
                    value: context.dtv_account_no ?? '123456789',
                }],
            },
        ], {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        console.log('Customer patch successfully');

        return {};
}
