import axios from 'axios';
import chalk from 'chalk';

export async function addFsiToCart(context: Record<string, any>): Promise<Record<string, any>> {

    let selectedProductId = context.root_product_type_id;

    // If we have available products, use the first one or the one specified in context
    if (context.available_products && context.available_products.length > 0) {
        console.log(chalk.cyan('\n===> Adding FSI Product to Cart <==='));
        
        // If a specific product is configured, find it
        if (context.root_product_type_id) {
            const product = context.available_products.find((p: any) => p.id === selectedProductId);
            if (product) {
                console.log(chalk.green(`\n✓ Using configured product: ${product.name}`));
                console.log(`  Product ID: ${selectedProductId}`);
                console.log(`  Description: ${product.description}`);
            } else {
                console.log(chalk.yellow(`\n⚠ Configured product ID '${selectedProductId}' not found in available products.`));
                console.log(chalk.yellow('Using first available product instead.'));
                selectedProductId = context.available_products[0].id;
                console.log(chalk.green(`\n✓ Selected: ${context.available_products[0].name}`));
                console.log(`  Product ID: ${selectedProductId}`);
                console.log(`  Description: ${context.available_products[0].description}`);
            }
        } else {
            // No product configured, use first available
            selectedProductId = context.available_products[0].id;
            const firstProduct = context.available_products[0];
            console.log(chalk.green(`\n✓ Using first available product: ${firstProduct.name}`));
            console.log(`  Product ID: ${selectedProductId}`);
            console.log(`  Description: ${firstProduct.description}`);
        }
    } else if (!context.root_product_type_id) {
        // No products available and no default ID provided
        console.log(chalk.red('\n✗ No products available and no default product ID provided.'));
        console.log(chalk.red('Cannot proceed with adding FSI to cart.'));
        context.stop_orchestration = true;
        return { stop_orchestration: true };
    } else {
        console.log(chalk.yellow('\nUsing configured product ID.'));
        console.log(`Product ID: ${selectedProductId}`);
    }

    const response = await axios.post(`${context.baseUrl}/v1/sales/cart/items`, {
        product_type_id: selectedProductId,
        shopping_cart_id: context.cart_id,
    }, {
        headers: {
            Authorization: `Bearer ${context.jwt_token}`,
            'trace-id': context['trace-id'],
            'Content-Type': 'application/json',
        },
    });

    const responseJson = response.data;

    console.log(chalk.green('\n✓ FSI added to cart successfully!'));
    console.log('Cart ID:', responseJson.id);

    return { 
        cart_id: responseJson.id,
        selected_product_id: selectedProductId
    };
}