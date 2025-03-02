import Router from 'express';

import RequestHandler from '../classes/RequestHandler.js';
import OrderCalculator from '../classes/OrderCalculator.js';

export const router = Router();

/**
 * POST http://localhost:9000/api/v1/orders
 * 
 * This is the order creation endpoint. 
 * It takes an array of orders and returns the total cost of each order (in a formatted string).
 * 
 * It expects POST requests with a body (json) like:
 * [
 *   { "quantity": 6, "code": "L09" },
 *   { "quantity": 3, "code": "T58" },
 *   { "quantity": 5, "code": "R12" },
 *   { "quantity": 10, "code": "R12" }
 * ]
 * 
 */
router.post('/', async (req, res) => {
    try {
         // Create a new RequestHandler instance with the incoming request.
        let requestHandler = new RequestHandler(req);

        // Validate the order payload and get the orders.
        const orders = await requestHandler.getOrders(req);

        // Initialize an array to hold the order bundling results.
        let results = []

        // Iterate over each order and calculate the bundle breakdown for each.
        for (let order of orders) {
            const result = await OrderCalculator.calculateBundle(order);
            results.push(result);
        }

        // Format the results for the request response.
        const formatedResults = await requestHandler.formatOrders(results)

        // Send a success response with the formatted results.
        res.status(200).send({
            message: 'Order was successfully created!',
            results: formatedResults
        });
    } catch (error) {
        // Send an error response if something goes wrong.
        res.status(500).send({
            message: `An error occurred while creating the order! : ${error.message}`
        });
    }
});