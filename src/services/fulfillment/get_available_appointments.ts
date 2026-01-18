import axios from 'axios';
import { buildQueryString } from '../../utils/queryString';

export async function getAvailableAppointments(context: Record<string, any>): Promise<Record<string, any>> {
        // Build the query string using the utility function
        const queryString = buildQueryString({
            from: context.from_date,
            to: context.to_date,
            address_lines: context.address_lines,
            municipality: context?.municipality,
            region: context?.region,
            postal_code: context.postal_code,
            country_code: context?.country_code,
            fulfillment_agreement_id: "6b52034d-a5f6-47a7-8c56-b2319688205e",
            shopping_cart_id: context.cart_id,
        });

        const response = await axios.get(`${context.baseUrl}/v1/fulfillment/appointments?${queryString}`, {
            headers: {
                Authorization: `Bearer ${context.jwt_token}`,
                'Content-Type': 'application/json',
                'trace-id': context['trace-id'],
            },
        });

        const responseJson = response.data;

        // Extract the first schedule
        const firstSchedule = responseJson.schedules[0];

        // Save the appointment details in the context
        context.appointment_start_time = firstSchedule.from;
        context.appointment_end_time = firstSchedule.to;

        console.log('Available appointments:', {
            ...responseJson,
            schedules: responseJson.schedules.length > 5 ? [...responseJson.schedules.slice(0, 5),`...${responseJson.schedules.length - 5} more`] : responseJson.schedules,
        });

        return {
            appointment_start_time: firstSchedule.from,
            appointment_end_time: firstSchedule.to,
        };
}