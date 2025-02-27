import Router from 'express';

import RequestHandler from '../classes/RequestHandler.js';
import OrderCalculator from '../classes/OrderCalculator.js';

export const router = Router();

router.post('/', async (req, res) => {
    try {
        let requestHandler = new RequestHandler(req);

        const orders = await requestHandler.getOrders(req);

        let results = []

        for (let order of orders) {
            const result = await OrderCalculator.calculateBundle(order);
            results.push(result);
        }

        const formatedResults = await requestHandler.formatOrders(results)
        res.status(200).send({
            message: 'Order was successfully created!',
            results: formatedResults
        });
    } catch (error) {
        res.status(500).send({
            message: `An error occurred while creating the order! : ${error.message}`
        });
    }
});