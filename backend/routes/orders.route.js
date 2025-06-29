import express from 'express';
import { placeOrder } from '../controllers/orders.contoller.js';
import authenticateUser from '../middlewares/authenticate.user.js';

const router = express.Router();

router.post('/', authenticateUser, placeOrder);

export default router;
