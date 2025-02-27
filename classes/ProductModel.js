import Model from "./Model.js";

export default class ProductModel extends Model {
    static products = {
        "R12": { code: "R12", name: "Roses", bundles: [10, 5], prices: { 10: 12.99, 5: 6.99 }},
        "L09": { code: "L09", name: "Lilies", bundles: [9, 6, 3], prices: { 9: 24.95, 6: 16.95, 3: 9.95 }},
        "T58": { code: "T58", name: "Tulips", bundles: [9, 5, 3], prices: { 9: 16.99, 5: 9.95, 3: 5.95 }},
        "TEST": { code: "TEST", name: "Test", bundles: [97, 9, 3, 2], prices: { 9: 16.99, 3: 9.95, 2: 5.95 }} 
    };

    static async addProduct(product) {
        if (!product.code || !product.name || !product.bundles || !product.prices) {
            throw new Error("Invalid product");
        }

        product.bundles.sort((a, b) => b - a);
        
        this.products[product.code] = product;
    }

    static async getProduct(code) {
        return this.products[code];
    }
}