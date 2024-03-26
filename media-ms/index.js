import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';

const port = process.env.PORT || 9999;
const app = express();

import multer from 'multer';
import feedRoutes, { subToChannel } from './routes/feed.js'
import { channel, connectToRabbitMQ } from './messaging/connect.js';


app.disable('x-powered-by');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'none');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Content-Type: multipart/form-data');
  next();
});


app.use('/api/media', feedRoutes);

// General error handling
app.use((error, req, res, next) => {
    if(error instanceof multer.MulterError){
      if(error.code == "LIMIT_FILE_SIZE"){
        return res.status(400).json({
          message: "One of the files is too large. Upload canceled"
        })
      }
      else if(error.code == "LIMIT_FILE_COUNT"){
        return res.status(400).json({
          message: "Selected too many files for upload. Upload canceled"
        })
      }
    }
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
    console.log(message);
    next();
});

await connectToRabbitMQ();
app.listen(port, async () => { 
  console.log(`REST API listening on port: ${port}`) 
  if(channel){
    await subToChannel(channel);
  }
});