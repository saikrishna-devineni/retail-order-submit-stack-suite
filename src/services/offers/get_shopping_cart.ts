import axios from 'axios';
import chalk from 'chalk';
import Table from 'cli-table3';

export async function getShoppingCart(context: Record<string, any>): Promise<Record<string, any>> {

    const response = await axios.get(`${context.baseUrl}/v1/sales/cart/${context.cart_id}`, {
        headers: {
            Authorization: `Bearer ${context.jwt_token}`,
            'trace-id': context['trace-id'],
        },
    });

    const responseJson = response.data;
    
    // Create cart items table
    const cartItemsTable = new Table({
        head: [
            chalk.cyan('Product Name'), 
            chalk.cyan('Type'), 
            chalk.cyan('Candidate ID'), 
            chalk.cyan('Recurrence'), 
            chalk.cyan('Amount'), 
            chalk.cyan('Currency')
        ],
        colWidths: [25, 30, 40, 15, 12, 12],
        wordWrap: true
    });
    
    // Extract and populate cart items
    for (let product of responseJson.cart_items) {
        if (product.kind === 'bep.ofm.product-types.fixed-satellite-internet') {
            context.root_product_candidate_id = product.product_candidate_id;
        }

        // Simplify kind by taking the last part after splitting
        const simplifiedKind = product.kind.split('.').pop() || product.kind;

        // Add rows for each price
        if (product.prices && product.prices.length > 0) {
            product.prices.forEach((price: any, index: number) => {
                cartItemsTable.push([
                    index === 0 ? product.name : '', // Show product name only on first row
                    index === 0 ? simplifiedKind : '', // Show simplified kind only on first row
                    index === 0 ? product.product_candidate_id : '', // Show candidate ID only on first row
                    price?.recurrence || 'N/A',
                    price?.amount?.value || 'N/A',
                    price?.amount?.currency?.alphabetic_code || 'N/A'
                ]);
            });
        } else {
            cartItemsTable.push([
                product.name,
                simplifiedKind,
                product.product_candidate_id,
                'N/A',
                'N/A',
                'N/A'
            ]);
        }
    }

    // Create cart totals table
    const cartTotalsTable = new Table({
        head: [
            chalk.cyan('Recurrence'), 
            chalk.cyan('Amount'), 
            chalk.cyan('Currency')
        ],
        colWidths: [20, 15, 12]
    });
    
    // Extract and populate cart totals
    for (let total_price of responseJson.cart_total_prices) {
        cartTotalsTable.push([
            total_price.recurrence,
            total_price?.amount?.value || 'N/A',
            total_price?.amount?.currency?.alphabetic_code || 'N/A'
        ]);

        // Store ONCE amount for payment
        if (total_price.recurrence === 'ONCE') {
            context.payment_amount = total_price?.amount?.value || 0;
        }
    }

    // Display tables
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                      Shopping Cart Items                               ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════════════╝'));
    console.log(cartItemsTable.toString());

    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║                         Cart Totals                                    ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════════════╝'));
    console.log(cartTotalsTable.toString());

    console.log(chalk.green(`\n💰 Payment Amount (ONCE): ${context.payment_amount ? `$${context.payment_amount}` : 'N/A'}`));

    return {
        root_product_candidate_id: context.root_product_candidate_id,
    };
}