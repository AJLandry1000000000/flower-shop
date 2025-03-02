import Model from "./Model.js";

export default class ProductModel extends Model {
    // Set the table name for the ProductModel.
    static tableName = "products";

    /**
     * Method to add a new product to the database. 
     * It runs a validation check on the product object before inserting it into the database.
     * 
     * @param {*} product 
     */
    static async addProduct(product) {
        if (!product.code || !product.name || !product.bundles || !Array.isArray(orders) || orders.length === 0|| !product.prices) {
            throw new Error("Invalid product");
        }

        // Check every bundle has a price.
        for (const bundle of product.bundles) {
            if (!product.prices[bundle]) {
                throw new Error("Invalid product");
            }
        }

        // Sort the bundles in descending order. 
        // This is important in our minimum bundle calculation.
        product.bundles.sort((a, b) => b - a);
        
        // Insert the product into the database.
        await super.insert(product);
    }

    /**
     * Method to get a product from the database by its code.
     * 
     * @param {*} code 
     * @returns 
     */
    static async getProduct(code) {
        return await super.findBy({ code });
    }
}