import ProductModel from "./ProductModel.js";

export default class OrderCalculator {
    static async calculateBundle(order) {
        let quantity = order.quantity;

        let productCode = order.code;

        let product = await ProductModel.getProduct(productCode);
    
        if (!product) {
            throw new Error(`Product "${productCode}" not found!`);
        }
    
        product.bundles.sort((a, b) => b - a);
    
        console.log(`product bundles: ${product.bundles}`);
    
        let bundles = this.recursiveBundleCalculator(product, quantity);

        if (!bundles) {
            return {
                name: product.name,
                code: product.code,
                requested_quantity: quantity,
                no_solution: `No bundle combination found for ${quantity} ${product.code}`,
                total_cost: 0,
            }
        }

        bundles.requested_quantity = quantity;

        return bundles;
    }
    
    /**
     * The solution is to use a backtracking recursive function to calculate the minimum bundles for the order.
     * 
     * Where at every level of the recursion we use the product's largest bundle size that is less than or equal to the quantity. 
     * 
     * We then subtract those bundles from the quantity and recurse to repeat the process until we have a solution (i.e. until quantity = 0). 
     * 
     * If there a recursion path leads to no results, we backtrack to the previous recurse, remove a bundle and try again.
     * 
     * If we have removed all the bundles we can with the current bundle size, we reduce the bundle size, 
     * and repeat the process of taking the most bundles of that size and subtracting it from the quantity.
     * 
     * 
     * Note: 
     * - product.bundles is sorted in descending order, so we always begin with the largest bundle size.
     * - The function returns null if there is no solution.
     * 
     * @param {*} product 
     * @param {*} quantity 
     * @returns 
     */
    static recursiveBundleCalculator(product, quantity) {
        if (quantity === 0) {
            let result = {
                name: product.name,
                code: product.code,
                total_cost: 0,
            };
    
            for (let bundleQuantity of product.bundles) {
                result[bundleQuantity] = 0;
            }
    
            return result;
        }
    
        for (let bundleQuantity of product.bundles) {
            if (bundleQuantity <= quantity) {
                let mostBundles = Math.floor(quantity / bundleQuantity);

                while (mostBundles > 0) {
                    let recursiveResults = this.recursiveBundleCalculator(product, quantity - (bundleQuantity * mostBundles));

                    if (recursiveResults) {      
                        console.log(`recurse!`)          
                        recursiveResults[bundleQuantity] += mostBundles;

                        recursiveResults.total_cost += product.prices[bundleQuantity] * mostBundles;

                        return recursiveResults;
                    }

                    mostBundles--;
                }
            }
        }
    
        return null;
    }
}