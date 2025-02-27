import ProductModel from "./ProductModel.js";

export default class RequestHandler {

    constructor(req) {
        this.request = req;
    }

    async getOrders() {
        let orders = this.request.body;

        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            throw new Error("Invalid order request!");
        }

        for (const order of orders) {
            if (!order.quantity || order.quantity <= 0 || !order.code) {
                throw new Error("Invalid order format!");
            }

            const product = await ProductModel.getProduct(order.code);

            if (!product) {
                throw new Error(`Product "${order.code}" not found!`);
            }
        }

        return orders;
    }

    async formatOrders(orders) {
        let formattedOrders = [];

        for (let order of orders) {
            formattedOrders.push(await this.formatOrder(order));
        }

        return formattedOrders;
    }

    async formatOrder(order) {
        if (!order.code || !('requested_quantity' in order) || !('total_cost' in order)) {
            throw new Error("Invalid order");
        }

        if (order.no_solution) {
            return `${order.requested_quantity} ${order.code} $0 : ${order.no_solution}`;
        }

        let orderString = `${order.requested_quantity} ${order.code} $${order.total_cost.toFixed(2)} : `;

        let product = await ProductModel.getProduct(order.code);

        for (const bundleQuantity of product.bundles) {
            let orderSize = order[bundleQuantity];
            
            if (orderSize === 0) {
                continue;
            }

            orderString += `${orderSize} x ${bundleQuantity} $${product.prices[bundleQuantity] * orderSize}, `;
        }

        // Remove the trailing comma.
        if (orderString.endsWith(', ')) {
            orderString = orderString.slice(0, -2);
        }

        console.log(`orderString = ${orderString}`);

        return orderString;
    }
}