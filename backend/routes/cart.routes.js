import express from 'express';
import {
  addItem,
  getCart,
  updateCartItemQuantity,
  deleteItem
} from '../controllers/cart.controller.js';

import authenticateUser from '../middlewares/authenticate.user.js';

const router = express.Router();

router.get('/', authenticateUser, getCart);
router.post('/add', authenticateUser, addItem);
router.post('/update-quantity', authenticateUser, updateCartItemQuantity);
router.delete('/deleteItem/:productId', authenticateUser, deleteItem);

export default router;
