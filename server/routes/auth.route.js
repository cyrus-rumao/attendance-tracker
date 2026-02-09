import Router from 'express';
import express from 'express';
import {
	signupvalidation,
	loginvalidation,
} from '../middlewares/auth.validation.middleware.js';
import {
	login,
	signup,
	logout,
	refreshToken,
	getProfile,
} from '../controllers/auth.controller.js';
import { get } from 'mongoose';
import { ProtectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();
router.post('/login', loginvalidation, login);
router.post('/signup', signupvalidation, signup);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', ProtectRoute, getProfile);

export default router;
