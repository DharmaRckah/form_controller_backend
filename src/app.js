import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

app.use(errorMiddleware);

export default app;
