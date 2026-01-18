import axios from 'axios';
import { randomUUID } from 'crypto';

export async function updateEIC(context: Record<string, any>): Promise<Record<string, any>> {
        for (const candidate_id of context.eic_root_candidate_ids) {
            const response = await axios.patch(
                `${context.baseUrl}/v1/sales/cart/${context.cart_id}/items/${candidate_id}`,
                {
                    op: "ADD",
                    path: "/eic",
                    value: [
                        {
                            name: "CPQ_USER_CONSENT",
                            value: "YES"
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${context.jwt_token}`,
                        'trace-id': context['trace-id'],
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(`EIC message for product candidate ID ${candidate_id} has been updated. Trace ID: ${context['trace-id']}`);
            context['trace-id'] = randomUUID();
        }

        return {};
}