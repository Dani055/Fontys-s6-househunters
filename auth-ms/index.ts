
import express, { Express, ErrorRequestHandler, Router } from 'express';
import dotenv from 'dotenv';
dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})
import 'shared/sentry/instrument'
import * as Sentry from '@sentry/node';

import bodyParser from 'body-parser';

import authRoutes from './src/routes/auth'
import userRoutes from './src/routes/user'
import connectToDB from './src/database/database';
import { seedAdminUser } from './src/models/User';
import { connectToRabbitMQ } from './src/messaging/connect';

const router = Router()

const port = process.env.PORT;
const app: Express = express();

app.disable('x-powered-by');
app.disable('Access-Control-Allow-Origin');
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'none');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ping', router.get('/', (req, res, next) => {
  return res.status(200).json("Server running");
}));
app.use('/', router.get('/', (req, res, next) => {
  return res.status(200).json("Server running");
}));

// General error handling
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  let message;
  // Sentry monitoring
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
  next()
}
app.use(errorHandler);

export const start = async () => {
  await connectToDB();
  if(process.env.NODE_ENV !== 'test'){
    await seedAdminUser()
    // Auth-ms is publisher only, no need to subscribe to exchanges
    await connectToRabbitMQ();
    app.listen(port, () => { console.log(`REST API listening on port: ${port}`) });
  }
  app.emit("appStarted");
}

start();

export default app;
