import Router from 'express';
import { calculateBundle } from '../services/bundleCalculator.js';

export const router = Router();

router.post('/', async (req, res) => {
    try {
        const orders = req.body;
        let results = []
        for (let order of orders) {
            const result = calculateBundle(order.code, order.quantity);
            results.push({ product: order.code, ...result });
            console.log(result);
            console.log(order);
        }
        res.status(200).send({
            message: 'Order created successfully',
            results: results
        });
    } catch (error) {
        res.status(500).send({
            message: `An error occurred while creating the order : ${error.message}`
        });
    }

});