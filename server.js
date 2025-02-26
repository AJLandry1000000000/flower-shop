import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { router } from './routes/orders.js';

const PORT = process.env.PORT || 3000;

const app = express(); 

app.use(bodyParser.json());
app.use(cors());

const baseUrl = '/api/v1';
app.use(baseUrl + '/orders', router)

app.listen(PORT, async () => {
    console.log(`The application server is running on port: ${PORT} `);
});