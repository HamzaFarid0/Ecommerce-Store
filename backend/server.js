import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import searchRouter from './routes/search.routes.js';
import protectedRoute from './routes/protectedRoute.routes.js';
import cartRoute from './routes/cart.routes.js';
import ordersRoute from './routes/orders.route.js';

import connectDB from './config/db.js';
import './cron/cleanupUnverifiedUsers.js'; // for side-effect only (no export)


const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:4200', // Your frontend URL
  credentials: true
}));
app.use(cookieParser());

app.use(express.json()); 

connectDB()
  
app.use('/api/auth' , authRouter)
app.use('/api/products' , productRouter)
app.use('/api/search' , searchRouter )
app.use('/api/protectedRoute' , protectedRoute )
app.use('/api/cart' , cartRoute )
app.use('/api/orders' , ordersRoute )

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}...`);
});
