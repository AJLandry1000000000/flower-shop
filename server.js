import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { router } from './routes/orders.js';

// Define the port for the application server.
const PORT = process.env.PORT || 9000;

// Create an express application.
const app = express(); 

// Use body-parser middleware to parse JSON requests.
app.use(bodyParser.json());

// Use CORS middleware to enable Cross-Origin Resource Sharing (good practice).
app.use(cors());

// Define the base URL for the API.
const baseUrl = '/api/v1';

// Use the orders router for the /orders endpoint.
app.use(baseUrl + '/orders', router)

// Start the server on the defined port.
app.listen(PORT, async () => {
    console.log(`The application server is running on port: ${PORT} `);
});