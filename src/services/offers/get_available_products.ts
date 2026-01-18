import axios from 'axios';
import chalk from 'chalk';

export async function getAvailableProducts(context: Record<string, any>): Promise<Record<string, any>> {
        const response = await axios.post(
            `${context.baseUrl}/v1/sales/products/available-products`,
            {
                sales_agreement_id: context.sales_agreement_id,
                location: {
                    coordinates: {
                        latitude: context.latitude,
                        longitude: context.longitude,
                    },
                    address: {
                        address_lines: [`${context.address_lines}`],
                        region: context.region,
                        postal_code: context.postal_code,
                        country_code: context.country_code,
                    },
                },
                tax_identification: {
                    country_code: "US",
                    dob: context.dob || "1990-01-01",
                },
                customer_party_id: context.customer_party_id,
                product_segment: "RESIDENTIAL",
                offer_id: context.cart_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${context.jwt_token}`,
                    "trace-id": context["trace-id"],
                },
            }
        );

        const responseJson = response.data;

        // Build available products list
        const availableProducts: any[] = [];
        let isCreditCheckMissed = context.root_product_type_id ? true : false;

        for (let product of responseJson.product_types) {
            // Pick FSI except Voice-Only
            if (
                product.kind === "bep.ofm.product-types.fixed-satellite-internet" &&
                !product.name.toLowerCase().includes("voice-only")
            ) {
                // Check credit check status
                if (context.root_product_type_id === product.id) {
                    isCreditCheckMissed = false;
                }

                // Get display order
                let displayOrder = 999;
                product.marketing_copy?.ui_behaviors?.characteristics?.forEach((characteristic: any) => {
                    if (characteristic.name === 'DISPLAY_ORDER') {
                        displayOrder = parseInt(characteristic.value) || 999;
                    }
                });

                // Add to available products
                availableProducts.push({
                    id: product.id,
                    name: product.name,
                    description: product.description || 'No description available',
                    offer_id: product.offer_id,
                    display_order: displayOrder,
                    prices: product.prices?.map((price: any) => ({description: price?.description, amount: price?.amount?.value})),
                    marketing_copy: product.marketing_copy
                });
            }
        }

        console.log(chalk.cyan('\n===> FSI Products Retrieved from Available Products API <==='));

        context.stop_orchestration = availableProducts.length === 0;

        // Sort by display order
        availableProducts.sort((a, b) => a.display_order - b.display_order);

        console.log(chalk.cyan('\n===> Available Products <==='));
        availableProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} (Display Order: ${product.display_order})`);
            console.log(`   ID: ${product.id}`);
            console.log(`   Description: ${product.description}`);
            console.log(`   Prices:`);
            product.prices.forEach((price: any) => {
                console.log(`     - ${price.description}: $${price.amount}`);
            });
            console.log('');
        });

        console.log('Credit Check:', isCreditCheckMissed ? chalk.red('Missed') : chalk.green('Passed'));

        return {
            available_products: availableProducts,
            root_product_type_id: context.root_product_type_id,
            cart_id: context.cart_id || availableProducts[0]?.offer_id,
        };

}