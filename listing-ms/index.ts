
import express, { Express, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

import bodyParser from 'body-parser';
import cors from 'cors';

import listingRoutes from './src/routes/listing'
import commentRoutes from './src/routes/comment'
import connectToDB from './src/database/database';
import { connectToRabbitMQ } from './src/messaging/connect';
import { subToExchanges } from './src/routes/subscribtions';

const port = process.env.PORT;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/listing', listingRoutes);
app.use('/api/comment', commentRoutes);

// General error handling
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  let message;
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
    app.listen(port, async () => 
    { 
      console.log(`REST API listening on port: ${port}`) 
      await connectToRabbitMQ();
      await subToExchanges();
    });
  }
  app.emit("appStarted");
}

start();

export default app;
