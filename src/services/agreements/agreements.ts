import chalk from "chalk";
import { buildQueryString } from "../../utils/queryString";
import axios from "axios";

export async function agreements(
  context: Record<string, any>
): Promise<Record<string, any>> {
  // Build the query string using the utility function
  const queryString = buildQueryString({
    partner_party_id: context.partner_party_id,
    business_unit_party_id: context.business_unit_party_id,
    address_lines: context.address_lines,
    municipality: context.municipality,
    region: context.region,
    postal_code: context.postal_code,
    country_code: context.country_code,
    latitude: context.latitude,
    longitude: context.longitude,
  });
  // Build the query string using the utility function
  const response = await axios.get(
    `${context.baseUrl}/v1/retail/agreements/agreements?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${context.jwt_token}`,
        "trace-id": context["trace-id"],
      },
    }
  );

  const responseJson = response.data;

  // Extract agreements
  const bothRetrieved = [false, false]; // Track whether SALES and FULFILLMENT agreements are retrieved

  for (let agreement of responseJson.agreements) {
    if (agreement.agreement_type === "SALES" && !bothRetrieved[0]) {
      context.sales_agreement_id = agreement.id; // Set the SALES agreement ID in the context
      bothRetrieved[0] = true;
    }
    if (agreement.agreement_type === "FULFILLMENT" && !bothRetrieved[1]) {
      context.fulfillment_agreement_id = agreement.id; // Set the FULFILLMENT agreement ID in the context
      bothRetrieved[1] = true;
    }
    if (bothRetrieved[0] && bothRetrieved[1]) {
      break; // Exit the loop once both agreements are found
    }
  }

  const agreementsFound = responseJson.agreements.map((a: any) => ({
      id: a.id,
      name: a.name,
      agreement_type: a.agreement_type,
      dealer_id: a?.characteristics.filter(
        (c: any) => c.name === "dealerId"
      )[0]?.value,
    }));


  console.log("Retrieved Agreements:", chalk.blue(JSON.stringify(agreementsFound, null, 2)));

  return {
    sales_agreement_id: context.sales_agreement_id,
    fulfillment_agreement_id: context.fulfillment_agreement_id,
  };
}
