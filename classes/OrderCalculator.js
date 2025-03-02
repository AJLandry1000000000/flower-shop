import ProductModel from "./database/ProductModel.js";

export default class OrderCalculator {
    /**
     * Method to calculate the bundle for an order.
     * 
     * @param {*} order 
     * @returns 
     */
    static async calculateBundle(order) {
        // Get the quantity from the order.
        const quantity = order.quantity; 
    
        // Get the product code from the order.
        const productCode = order.code; 

        // Get the product data from the database. If the product doesn't exist, throw an error.
        const product = await ProductModel.getProduct(productCode);
    
        if (!product) {
            throw new Error(`Product "${productCode}" not found!`);
        }
    
        // Sort the bundles in descending order. 
        // This is defensive code, because technically we have already sorted the bundles in the database on insertion (see the addProduct method in ProductModel).
        product.bundles.sort((a, b) => b - a);
    
        // Optimal solution: Calculate the bundles using dynamic programming.
        let bundles = this.dynamicBundleCalculator(product, quantity);

        // Alternative solution: Calculate the bundles using recursive backtracking.
        // let bundles = this.recursiveBundleCalculator(product, quantity);

        if (!bundles) {
            return {
                name: product.name,
                code: product.code,
                requestedQuantity: quantity,
                noSolution: `No bundle combination found for ${quantity} ${product.code}`,
                totalCost: 0,
            }
        }

        bundles.requestedQuantity = quantity;

        return bundles;
    }

    /**
     * FINAL SOLUTION (dynamic programming)
     * 
     * This is the final solution used in the implementation.
     * 
     * It calculates the minimum number of bundles required for an order using dynamic programming.
     * 
     * It uses an array, 'dp', where each array index represents a quantity, and the value at that index is the minimum number 
     * of bundles required to reach that quantity.
     * 
     * It sets its value by considering every bundle size, 'bundleQuantity', for each index, 'i'. 
     * 
     * It checks if the bundles are minimised at quantity 'i' if filled with 'bundleQuantity' by comparing the total bundles 
     * required at 'i' with the total bundles required at 'i - bundleQuantity' + 1 (the +1 is for the addition of the current 'bundleQuantity). 
     * 
     * @param {*} product 
     * @param {*} quantity 
     * @returns 
     */
    static dynamicBundleCalculator(product, quantity) {
        let infinityBundle = this.emptyBundle(product)
        infinityBundle.totalBundleCount = 1000;

        let dp = new Array(quantity + 1).fill({ ...infinityBundle });

        dp[0] = this.emptyBundle(product);

        for (let i = 1; i <= quantity; i++) {
            for (let bundleQuantity of product.bundles) {
                if (bundleQuantity <= i) {
                    let currentBundle = dp[i];

                    let previousBundle = dp[i - bundleQuantity];

                    if (previousBundle.totalBundleCount + 1 < currentBundle.totalBundleCount) {
                        dp[i] = { bundleQuantity, totalBundleCount: previousBundle.totalBundleCount + 1 };
                    }
                }
            }
        }

        return this.buildResultsFromDynamicBundleCalculator(product, quantity, dp);
    }

    /**
     * Method to create an empty bundle object.
     * This function to initialise the dp array in the dynamic programming solution.
     * 
     * @returns 
     */
    static emptyBundle() {
        let emptyBundle = {
            bundleQuantity: 0,
            totalBundleCount: 0,
        };
        
        return emptyBundle;
    }

    /**
     * Method to build the results from the dynamic bundle calculator.
     * 
     * @param {*} product 
     * @param {*} quantity 
     * @param {*} dp 
     * @returns 
     */
    static buildResultsFromDynamicBundleCalculator(product, quantity, dp) {
        if (dp[quantity].bundleQuantity == 0 || dp[quantity].totalBundleCount == Infinity) {
            return null;
        }

        let result = {
            name: product.name,
            code: product.code,
            requestedQuantity: quantity,
            totalCost: 0,
        };

        let currentQuantity = quantity;
        while (currentQuantity > 0) {
            let currentBundle = dp[currentQuantity];
            
            if (!result.hasOwnProperty(currentBundle.bundleQuantity)) {
                result[currentBundle.bundleQuantity] = 0;
            }
            
            result[currentBundle.bundleQuantity] += 1;
            
            result.totalCost += product.prices[currentBundle.bundleQuantity];
            
            currentQuantity -= currentBundle.bundleQuantity
        }

        return result;
    }










    
    /**
     * ALTERNATIVE SOLUTION (recursive backtracking)
     * 
     * This is an alternative solution to the dynamic programming solution above. 
     * It is less optimal so wasn't used in the final implementation, but it is included here for reference.
     * 
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
                totalCost: 0,
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
                        recursiveResults[bundleQuantity] += mostBundles;

                        recursiveResults.totalCost += product.prices[bundleQuantity] * mostBundles;

                        return recursiveResults;
                    }

                    mostBundles--;
                }
            }
        }
    
        return null;
    }
}