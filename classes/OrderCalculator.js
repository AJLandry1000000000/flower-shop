import res from "express/lib/response.js";
import ProductModel from "./database/ProductModel.js";

export default class OrderCalculator {
    static async calculateBundle(order) {
        let quantity = order.quantity;

        let productCode = order.code;

        let product = await ProductModel.getProduct(productCode);
    
        if (!product) {
            throw new Error(`Product "${productCode}" not found!`);
        }
    
        product.bundles.sort((a, b) => b - a);
    
        // console.log(`product bundles: ${product.bundles}`);
    
        // let bundles = this.recursiveBundleCalculator(product, quantity);

        let bundles = this.dynamicBundleCalculator(product, quantity);

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

    static dynamicBundleCalculator(product, quantity) {
        let infinity_bundle = this.emptyBundle(product)
        infinity_bundle.total_bundle_count = 1000;
        let dp = new Array(quantity + 1).fill({ ...infinity_bundle });
        // console.log(`dp: ${JSON.stringify(dp)}`);
        // console.log(`product: ${JSON.stringify(product)}`);
        dp[0] = this.emptyBundle(product);

        for (let i = 1; i <= quantity; i++) {
            for (let bundle_quantity of product.bundles) {
                if (bundle_quantity <= i) {
                    // let new_total_bundles = Math.min(dp[i].total_bundle_count, dp[i - bundle_quantity].total_bundle_count + 1);
                    let current_bundle = dp[i];
                    let previous_bundle = dp[i - bundle_quantity]
                    if (previous_bundle.total_bundle_count + 1 < current_bundle.total_bundle_count) {
                        // console.log(`i: ${i}, bundle_quantity: ${bundle_quantity}, previous_bundle: ${JSON.stringify(previous_bundle)}`);
                        dp[i] = { bundle_quantity, total_bundle_count: previous_bundle.total_bundle_count + 1 };
                        // dp[i].bundle_quantity = bundle_quantity;
                        // dp[i].total_bundle_count = previous_bundle.total_bundle_count + 1;
                    }
                }
            }
        }

        if (dp[quantity].total_bundle_count === Infinity) {
            return null;
        }

        console.log(`dp: ${JSON.stringify(dp)}`);

        let result = {
            name: product.name,
            code: product.code,
            requested_quantity: quantity,
            total_cost: 0,
        };

        let current_quantity = quantity;
        while (current_quantity > 0) {
            let current_bundle = dp[current_quantity];
            
            if (!result.hasOwnProperty(current_bundle.bundle_quantity)) {
                result[current_bundle.bundle_quantity] = 0;
            }
            
            result[current_bundle.bundle_quantity] += 1;
            
            result.total_cost += product.prices[current_bundle.bundle_quantity];
            
            current_quantity -= current_bundle.bundle_quantity
        }

        // console.log(`result: ${JSON.stringify(result)}`);

        return result;
    }

    static emptyBundle(product) {
        let emptyBundle = {
            bundle_quantity: 0,
            total_bundle_count: 0,
        };
        
        return emptyBundle;
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
                        // console.log(`recurse!`)          
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