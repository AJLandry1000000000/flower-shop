import Model from "./Model.js";

export default class ProductModel extends Model {
    static tableName = "products";

    static async addProduct(product) {
        if (!product.code || !product.name || !product.bundles || !Array.isArray(orders) || orders.length === 0|| !product.prices) {
            throw new Error("Invalid product");
        }

        // Check every bundle has a price.
        for (let bundle of product.bundles) {
            if (!product.prices[bundle]) {
                throw new Error("Invalid product");
            }
        }

        // Sort the bundles in descending order. 
        // This is important in our minimum bundle calculation.
        product.bundles.sort((a, b) => b - a);
        
        await super.insert(product);
    }

    static async getProduct(code) {
        return await super.findBy({ code });
    }
}