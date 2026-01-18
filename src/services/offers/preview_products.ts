import axios from "axios";

export async function previewProducts(
  context: Record<string, any>
): Promise<Record<string, any>> {
  const response = await axios.post(
    `${context.baseUrl}/v1/sales/products/preview-products`,
    {
      sales_agreement_id: "3f9e0dd5-612a-49f6-9e22-15bebfbeb175",
      // || context.sales_agreement_id,
      location: {
        coordinates: {
          latitude: context.latitude,
          longitude: context.longitude,
        },
        address: {
          address_lines: [context.address_lines],
          region: context.region,
          postal_code: context.postal_code,
          country_code: context.country_code,
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${context.jwt_token}`,
        "trace-id": context["trace-id"],
      },
    }
  );

  const responseJson = response.data;

  let root_product_type_id, offer_id;

  for (let product of responseJson.product_types) {
    // Pick FSI except Voice-Only, otherwise, extending voice add-on fails
    if (
      product.kind === "bep.ofm.product-types.fixed-satellite-internet" &&
      !product.name.toLowerCase().includes("Voice-Only")
    ) {
      root_product_type_id = context.root_product_type_id || product.id;
      offer_id = context.cart_id || product.offer_id;
    }
  }

  const productsFound = responseJson.product_types.map((pt: any) => ({
        id: pt.id,
        name: pt.name,
        kind: pt.kind,
        prices: pt?.prices?.map((price: any) => ({description: price?.description, amount: price?.amount?.value})),
      }))
  // Log the response for debugging
  console.log(
    "Preview Products Response:", JSON.stringify( productsFound, null, 2)
  );

  return {
    root_product_type_id,
    cart_id: offer_id,
  };
}
