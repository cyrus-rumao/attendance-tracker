// import Router from 'express';
import { Router } from 'express';
import {
	loginValidation,
	signupValidation,
} from '../middlewares/validation.middleware.js';
import {
	login,
	signup,
	logout,
	refreshToken,
	getProfile,
} from '../controllers/auth.controller.js';
// import { get } from 'mongoose';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = Router();
router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protectRoute, getProfile);

export default router;
