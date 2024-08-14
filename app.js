import express from 'express';
import postRouter from './routes/postRouter.js';
import authRouter from './routes/authRouter.js';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import MongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(MongoSanitize());
app.use(xss());
app.use(express.json({ limit: '16kb' }));

// // to whitelist certain return parameters
// app.use(
//   hpp({
//     whitelist: [''],
//   })
// );

app.use(
  '/api',
  rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour',
  })
);

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/admin', authRouter);

app.all('*', (req, res, next) => {
  res.status(404).send(`Cannot find route ${req.originalUrl}`);
  next(new Error(`Cannot find ${req.originalUrl} on this server`));
});

export default app;
