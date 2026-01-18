import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';

export async function addFsiToCart(context: Record<string, any>): Promise<Record<string, any>> {

        let selectedProductId = context.root_product_type_id;

        // If we have available products, let user select
        if (context.available_products && context.available_products.length > 0) {
            console.log(chalk.cyan('\n===> Select FSI Product to Add to Cart <==='));
            
            const choices = context.available_products.map((product: any) => ({
                name: `${product.name}\n   ${product.description}`,
                value: product.id,
                short: product.name
            }));

            // Add option to cancel
            choices.push({
                name: chalk.red('Cancel - Do not add any product'),
                value: 'CANCEL',
                short: 'Cancel'
            });

            const answer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedProductId',
                    message: 'Select an FSI product to add to cart:',
                    choices: choices,
                    pageSize: 15
                }
            ]);

            if (answer.selectedProductId === 'CANCEL') {
                console.log(chalk.yellow('\n✗ User cancelled adding FSI to cart.'));
                context.stop_orchestration = true;
                return { cart_id: context.cart_id, stop_orchestration: true };
            }

            selectedProductId = answer.selectedProductId;
            
            // Find the selected product to show details
            const selectedProduct = context.available_products.find((p: any) => p.id === selectedProductId);
            
            console.log(chalk.green(`\n✓ Selected: ${selectedProduct.name}`));
            console.log(`  Product ID: ${selectedProductId}`);
            console.log(`  Description: ${selectedProduct.description}`);
        } else if (!context.root_product_type_id) {
            // No products available and no default ID provided
            console.log(chalk.red('\n✗ No products available and no default product ID provided.'));
            console.log(chalk.red('Cannot proceed with adding FSI to cart.'));
            context.stop_orchestration = true;
            return { stop_orchestration: true };
        } else {
            // Validate that the default product ID exists in available products
            if (context.available_products && context.available_products.length > 0) {
                const productExists = context.available_products.some((p: any) => p.id === selectedProductId);
                if (!productExists) {
                    console.log(chalk.red(`\n✗ Default product ID '${selectedProductId}' not found in available products.`));
                    context.stop_orchestration = true;
                    return { stop_orchestration: true };
                }
            }
            console.log(chalk.yellow('\nNo product selection needed. Using default product.'));
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