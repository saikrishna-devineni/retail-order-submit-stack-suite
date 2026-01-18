import axios from "axios";

export async function getOrder(
  context: Record<string, any>
): Promise<Record<string, any> | undefined> {

    const response = await axios.get(
      `${context.baseUrl}/v1/retail/orders/${context.order_id}`,
      {
        headers: {
          Authorization: `Bearer ${context.jwt_token}`,
          "trace-id": context["trace-id"],
        },
      }
    );

    const responseJson = response.data;

    console.log("Order Details:", responseJson);

    return {};

}
