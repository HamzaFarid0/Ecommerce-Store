import express from 'express';
import authenticateUser from '../middlewares/authenticate.user.js';
import { checkout, verifySession } from '../controllers/checkout.controller.js';

const router = express.Router();

router.post('/' ,authenticateUser, checkout);
router.get('/verify-session' , verifySession);

export default router;
