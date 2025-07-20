import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

//middlware to parse JSON bodies
app.use(ratelimiter);
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});