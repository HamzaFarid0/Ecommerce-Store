import express from 'express';
import { viewOrders } from '../controllers/orders.contoller.js';
import authenticateUser from '../middlewares/authenticate.user.js';

const router = express.Router();

router.get('/', authenticateUser, viewOrders);

export default router;
