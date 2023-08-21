import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';

import usersRoutes from './routes/users.routes.js';
import cartRoutes from './routes/cart.routes.js';
import indexRoutes from './routes/index.routes.js';
import payRoutes from './routes/payment.routes.js';
import orderRoutes from './routes/orders.routes.js';
import likesRoutes from './routes/likes.routes.js';

const app = express();
app
  .use(cors(corsOptions))
  .use(cookieParser())
  // .use(express.urlencoded({ extended: false }))
  .use(morgan('dev'))
  .use(express.json())

  .use(indexRoutes)
  .use('/api', usersRoutes)
  .use('/api', cartRoutes)
  .use('/api', payRoutes)
  .use('/api', orderRoutes)
  .use('/api', likesRoutes);

// .use(errorHandler);
export default app;
