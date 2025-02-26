const PRODUCTS = {
    "R12": { name: "Roses", bundles: [10, 5], prices: { 10: 12.99, 5: 6.99 }},
    "L09": { name: "Lilies", bundles: [9, 6, 3], prices: { 9: 24.95, 6: 16.95, 3: 9.95 }},
    "T58": { name: "Tulips", bundles: [9, 5, 3], prices: { 9: 16.99, 5: 9.95, 3: 5.95 }},
    "TEST": { name: "Test", bundles: [9, 3, 2], prices: { 9: 16.99, 3: 9.95, 2: 5.95 }} 
};

export function calculateBundle(productCode, quantity) {
    let product = PRODUCTS[productCode];

    if (!product) {
        throw new Error("Product not found");
    }

    product.bundles.sort((a, b) => b - a);

    console.log(`product bundles: ${product.bundles}`);

    return recursiveBundleCalculator(product, quantity);
}

function recursiveBundleCalculator(product, quantity) {
    if (quantity === 0) {
        let result = {
            name: product.name,
        };

        for (let bundleQuantity of product.bundles) {
            result[bundleQuantity] = 0;
        }

        return result;
    }

    for (let bundleQuantity of product.bundles) {
        if (bundleQuantity <= quantity) {
            const recursiveResults = recursiveBundleCalculator(product, quantity - bundleQuantity);

            if (recursiveResults) {
                recursiveResults[bundleQuantity] += 1;
                
                return recursiveResults;
            }
        }
    }

    return null;
}