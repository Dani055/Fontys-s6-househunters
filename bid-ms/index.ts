
import express, { Express, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config({path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'})

import bodyParser from 'body-parser';

import bidRoutes from './src/routes/bid'
import connectToDB from './src/database/database';
import { channel, connectToRabbitMQ } from './src/messaging/connect';
import { subToExchanges } from './src/routes/subscribtions';
import { seedDatabase } from './src/database/seed';

const port = process.env.PORT;
const app: Express = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/bid', bidRoutes);

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
