import request from 'supertest';
import express from 'express';
import { router } from '../routes/orders.js';;

const app = express();
app.use(express.json());
const baseUrl = '/api/v1';
app.use(baseUrl + '/orders', router);

describe('POST /orders', () => {
    it('Testing successful order creation using assignment examples', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([
                { "quantity": 10, "code": "R12" },
                { "quantity": 15, "code": "L09" },
                { "quantity": 13, "code": "T58" }
            ]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Order was successfully created!');
        expect(response.body.results).toStrictEqual([
            "10 R12 $12.99 : 1 x 10 $12.99",
            "15 L09 $41.90 : 1 x 9 $24.95, 1 x 6 $16.95",
            "13 T58 $25.85 : 2 x 5 $19.90, 1 x 3 $5.95"
        ]);
    });

    it('Testing successful order creation using one bundle examples', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([
                { "quantity": 6, "code": "L09" },
                { "quantity": 9, "code": "L09" },
                { "quantity": 3, "code": "L09" },
                { "quantity": 3, "code": "T58" },
                { "quantity": 5, "code": "T58" },
                { "quantity": 5, "code": "R12" },
                { "quantity": 10, "code": "R12" }
            ]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Order was successfully created!');
        expect(response.body.results).toStrictEqual([
            "6 L09 $16.95 : 1 x 6 $16.95",
            "9 L09 $24.95 : 1 x 9 $24.95",
            "3 L09 $9.95 : 1 x 3 $9.95",
            "3 T58 $5.95 : 1 x 3 $5.95",
            "5 T58 $9.95 : 1 x 5 $9.95",
            "5 R12 $6.99 : 1 x 5 $6.99",
            "10 R12 $12.99 : 1 x 10 $12.99"
        ]);
    });

    it('Testing successful order creation using multiple bundle examples', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([
                { "quantity": 1005, "code": "R12" },
                { "quantity": 89, "code": "T58" },
                { "quantity": 12, "code": "L09" }
            ]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Order was successfully created!');
        expect(response.body.results).toStrictEqual([
            "1005 R12 $1305.99 : 100 x 10 $1299.00, 1 x 5 $6.99",
            "89 T58 $168.81 : 9 x 9 $152.91, 1 x 5 $9.95, 1 x 3 $5.95",
            "12 L09 $34.90 : 1 x 9 $24.95, 1 x 3 $9.95"
        ]);
    });

    it('Testing invalid code error handling', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([
                { "quantity": 12, "code": "L09" },
                { "quantity": 12, "code": 'INVALID_CODE' },
                { "quantity": 1005, "code": "R12" }
            ]);

        expect(response.status).toBe(500);
        expect(response.body.message).toContain('Product "INVALID_CODE" not found!');
    });

    it('Testing invalid quantity error handling', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([
                { "quantity": 12, "code": "L09" },
                { "quantity": 0, "code": 'L09' },
                { "quantity": -1, "code": 'L09' },
                { "quantity": 1005, "code": "R12" }
            ]);

        expect(response.status).toBe(500);
        expect(response.body.message).toContain('Invalid order format!');
    });

    it('Testing empty payload error handling', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send();

        expect(response.status).toBe(500);
        expect(response.body.message).toContain('Invalid order request!');
    });

    it('Testing empty order list error handling', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send([]);

        expect(response.status).toBe(500);
        expect(response.body.message).toContain('Invalid order request!');
    });

    it('Testing wrong body format (object instead of a list) error handling', async () => {
        const response = await request(app)
            .post(`${baseUrl}/orders`)
            .send({});

        expect(response.status).toBe(500);
        expect(response.body.message).toContain('Invalid order request!');
    });
});