import express from 'express';
import { protectedRoute } from '../controllers/protectedRoute.js';
import authenticateUser from '../middlewares/authenticate.user.js';

const router = express.Router();

router.get('/', authenticateUser, protectedRoute);

export default router;
