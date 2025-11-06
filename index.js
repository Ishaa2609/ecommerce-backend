import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import serverless from 'serverless-http';

import Connection from './database/db.js';
import DefaultData from './default.js';
import Routes from './routes/route.js';

dotenv.config();
const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// API routes
app.use('/', Routes);

// Paytm setup (optional)
export let paytmMerchantkey = process.env.PAYTM_MERCHANT_KEY;
export let paytmParams = {
  MID: process.env.PAYTM_MID,
  WEBSITE: process.env.PAYTM_WEBSITE,
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
  INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
  ORDER_ID: uuid(),
  CUST_ID: process.env.PAYTM_CUST_ID,
  TXN_AMOUNT: '100',
  CALLBACK_URL: process.env.NODE_ENV === 'production'
    ? 'https://your-vercel-backend.vercel.app/callback'
    : 'http://localhost:5000/callback',
  EMAIL: 'kunaltyagi@gmail.com',
  MOBILE_NO: '1234567852'
};

// ✅ Cache DB connection
let isConnected = false;

// ✅ Serverless handler for Vercel
export const handler = serverless(async (req, res) => {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  // Connect to DB only once
  if (!isConnected) {
    await Connection(username, password);
    isConnected = true;

    // Load default data only once
    await DefaultData();
  }

  // Pass request to Express
  return app(req, res);
});

// ✅ Local server (for testing with `npm start`)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
