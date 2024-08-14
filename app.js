import express from 'express';
import postRouter from './routes/postRouter.js';
import authRouter from './routes/authRouter.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/admin', authRouter);

app.all('*', (req, res, next) => {
  res.status(404).send(`Cannot find route ${req.originalUrl}`);
  next(new Error(`Cannot find ${req.originalUrl} on this server`));
});

export default app;
