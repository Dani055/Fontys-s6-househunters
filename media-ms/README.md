# Introduction
This is a simple express js app intended for storing images.

## How it works
The app works with POST requests with multipart/form-data. It then extracts the images and uploads them to an Amazon S3 bucket.
The response consists of the URL's of the uploaded photos

## Limits
File size: 1mb
File extension: png, jpg, jpeg
File count: 10 per request