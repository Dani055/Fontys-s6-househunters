
import express, { Express, ErrorRequestHandler, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

import 'shared/sentry/instrument'
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';

import bidRoutes from './src/routes/bid'
import connectToDB from './src/database/database';
import { channel, connectToRabbitMQ } from './src/messaging/connect';
import { subToExchanges } from './src/routes/subscribtions';
import { seedDatabase } from './src/database/seed';

const port = process.env.PORT;
const app: Express = express();
const router = Router()

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'none');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/bid', bidRoutes);
app.use('/', router.get('/', (req, res, next) => {
  return res.status(200).json("Server running");
}));

// General error handling
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  let message;
  if(status >= 500){
    if(req.userId){
      Sentry.setUser({userId: req.userId, email: req.email, roles: req.userRoles});
    }
    Sentry.captureException(error);
  }
  if(error.name==="CastError"){
    message = `Invalid ${error.kind} for ${error.value}`
  }
  else{
    message = error.message;
  }
  res.status(status).json({ message: message });
  next();
}

app.use(errorHandler);

export const start = async () => {
  await connectToDB();
  if(process.env.NODE_ENV !== 'test'){
    if(process.env.SEED_DATA_E2E){
      await seedDatabase();
    }
    await connectToRabbitMQ();
    app.listen(port, async () => {
       console.log(`REST API listening on port: ${port}`)
       if(channel){
        await subToExchanges(channel);
       }
    });
  }
  app.emit("appStarted");
}

start();

export default app;
