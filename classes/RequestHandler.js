import ProductModel from "./database/ProductModel.js";

export default class RequestHandler {

    /**
     * Constructor to initialize the request handling object.
     * 
     * @param {*} req 
     */
    constructor(req) {
        this.request = req;
    }

    /**
     * Method to get and validate orders from the request body.
     * 
     * @returns {Array} orders
     * @throws {Error} if the order array is invalid.
     */
    async getOrders() {
        const orders = this.request.body;

        // Check if order array is valid.
        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            throw new Error("Invalid order request!");
        }

        // Validate each order in the array.
        for (const order of orders) {
            if (!order.quantity || order.quantity <= 0 || !order.code) {
                throw new Error("Invalid order format!");
            }

            // Check if the product exists in the database. If not, throw an error.
            const product = await ProductModel.getProduct(order.code);

            if (!product) {
                throw new Error(`Product "${order.code}" not found!`);
            }
        }

        return orders;
    }

    /**
     * Method to format the orders for response.
     * 
     * @param {Array} orders 
     * @returns {Array} formattedOrders
     */
    async formatOrders(orders) {
        let formattedOrders = [];

        // Format each order.
        for (let order of orders) {
            formattedOrders.push(await this.formatOrder(order));
        }

        return formattedOrders;
    }

    /**
     * Method to format a single order.
     * 
     * @param {*} order 
     * @returns 
     */
    async formatOrder(order) {
        // Validate the order object.
        if (!order.code || !('requestedQuantity' in order) || !('totalCost' in order)) {
            throw new Error("Invalid order");
        }

        // Handle case where no solution is found for the order.
        if (order.noSolution) {
            return `${order.requestedQuantity} ${order.code} $0 : ${order.noSolution}`;
        }

        // Initialize the order string with the requested quantity and total cost.
        let orderString = `${order.requestedQuantity} ${order.code} $${order.totalCost.toFixed(2)} : `;

        // Get the product details from the database.
        let product = await ProductModel.getProduct(order.code);

        // Append each bundle string to the full order string.
        for (const bundleQuantity of product.bundles) {
            let orderSize = order[bundleQuantity];
            
            if (!orderSize || orderSize === 0) {
                continue;
            }

            orderString += `${orderSize} x ${bundleQuantity} $${(product.prices[bundleQuantity] * orderSize).toFixed(2)}, `;
        }

        // Remove the trailing comma.
        if (orderString.endsWith(', ')) {
            orderString = orderString.slice(0, -2);
        }

        return orderString;
    }
}