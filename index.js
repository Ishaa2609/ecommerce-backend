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
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

app.use('/', Routes);

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// connect to database
Connection(username, password);

// load default data
DefaultData();

// paytm setup
export let paytmMerchantkey = process.env.PAYTM_MERCHANT_KEY;
export let paytmParams = {
  MID: process.env.PAYTM_MID,
  WEBSITE: process.env.PAYTM_WEBSITE,
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
  INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE_ID,
  ORDER_ID: uuid(),
  CUST_ID: process.env.PAYTM_CUST_ID,
  TXN_AMOUNT: '100',
  CALLBACK_URL: 'https://your-backend-name.vercel.app/callback',
  EMAIL: 'kunaltyagi@gmail.com',
  MOBILE_NO: '1234567852'
};

// ✅ Don't use app.listen() — export instead
export const handler = serverless(app);
// export default app;
