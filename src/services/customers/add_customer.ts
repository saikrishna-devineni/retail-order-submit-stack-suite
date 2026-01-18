import axios from 'axios';

export async function addCustomer(context: Record<string, any>): Promise<Record<string, any>> {

        const response = await axios.post(`${context.baseUrl}/v1/customer/customers`, {
            business_unit_id: context.business_unit_party_id,
            given_name: context.given_name,
            middle_name: context.middle_name,
            surname: context.surname,
            external_id: context.external_id,
            taxpayer_id: context.taxpayer_id,
            additional_external_ids: 
                context?.dtv_account_no 
                    ?   [
                            {
                                type_name: 'dtv_account_no',
                                value: context.dtv_account_no,
                            }
                        ] 
                    : [],
            contact: {
                primary: {
                    address: {
                        address_lines: [context.address_lines],
                        postal_code: context.postal_code,
                        municipality: context.municipality,
                        region: context.region,
                        country_code: context.country_code,
                    },
                    email: context.email,
                    phone_number: context.phone_number,
                },
                invoice: {
                    address: {
                        address_lines: [context.address_lines],
                        postal_code: context.postal_code,
                        municipality: context.municipality,
                        region: context.region,
                        country_code: context.country_code,
                    },
                    email: context.email,
                    phone_number: context.phone_number,
                },
                shipping: {
                    address: {
                        address_lines: [context.address_lines],
                        postal_code: context.postal_code,
                        municipality: context.municipality,
                        region: context.region,
                        country_code: context.country_code,
                    }
                },
                secondary: {
                    address: {
                        address_lines: [context.address_lines],
                        postal_code: context.postal_code,
                        municipality: context.municipality,
                        region: context.region,
                        country_code: context.country_code,
                    },
                    email: context.email,
                    phone_number: context.phone_number,
                }
            },
        }, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'trace-id': context['trace-id'],
                'Content-Type': 'application/json',
            },
        });

        const responseJson = response.data;

        // Log the response for debugging
        console.log('Party Id from add customer Response:', responseJson.id);

        return { customer_party_id: responseJson.id };

}