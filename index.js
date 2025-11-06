import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

import Connection from './database/db.js';
import DefaultData from './default.js';
import Routes from './routes/route.js';

dotenv.config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// API routes
app.use('/', Routes);

// Paytm setup
export let paytmMerchantkey = process.env.PAYTM_MERCHANT_KEY;
export let paytmParams = {
  MID: process.env.PAYTM_MID,
  WEBSITE: process.env.PAYTM_WEBSITE,
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
  INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
  ORDER_ID: uuid(),
  CUST_ID: process.env.PAYTM_CUST_ID,
  TXN_AMOUNT: '100',
  CALLBACK_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-vercel-backend.vercel.app/callback'
      : 'http://localhost:5000/callback',
  EMAIL: 'kunaltyagi@gmail.com',
  MOBILE_NO: '1234567852',
};

// ✅ Cache DB connection across invocations
let isDbInitialized = false;

async function initDbAndSeed() {
  if (isDbInitialized) return;

  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  await Connection(username, password); // your DB connect func
  await DefaultData();                  // seed data once

  isDbInitialized = true;
}

// ✅ Vercel serverless handler
export default async function handler(req, res) {
  try {
    await initDbAndSeed();
    // Express apps are just (req, res) handlers
    return app(req, res);
  } catch (err) {
    console.error('Error in serverless handler:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

// ✅ Local server (for `npm start`)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  initDbAndSeed()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to initialize DB:', err);
    });
}