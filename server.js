import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! -- Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from './app.js';

const dbConnectionString = process.env.DATABASE_URI.replace(
  '<password>',
  process.env.DATABASE_PASSWORD ?? '<NO PASSWORD>'
);

if (dbConnectionString) {
  mongoose
    .connect(dbConnectionString)
    .then(() => {
      console.log('Database connected successfully!');
    })
    .catch((error) => {
      console.error('Database connection failed...');
      console.log(error.message);
    });
} else {
  console.warn(
    'No DB Connection string provided. Please check your config.env file.'
  );
}

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Application is live on port: ${port}`);
  console.log(`Test locally with: http://localhost:${port}/api/v1`);
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! -- Shutting down');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
