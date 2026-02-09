// import UserModel from "../Models/UserModel.js";
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redis } from '../config/redis.js';

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});
	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
	// console.log('Tokens: ', accessToken, refreshToken);
	return { accessToken, refreshToken };
};

const storeRefreshToken = async (refreshToken, userId) => {
	try {
		const user = await User.findById(userId).select('email');
		if (!user) return;

		await redis.hset(
			`refresh_token:${user._id}`,
			'token',
			refreshToken,
			'email',
			user.email,
		);

		await redis.expire(`refresh_token:${userId}`, 7 * 24 * 60 * 60);
	} catch (err) {
		console.log(err);
	}
};

const setCookies = (res, accessToken, refreshToken) => {
	(res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' ? true : false,
		sameSite: 'lax',
		maxAge: 15 * 60 * 1000,
	}),
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		}));
};

export const signup = async (req, res) => {
	const { name, email, password } = req.body;
	console.log('Signup Request', req.body);
	try {
		const existinguser = await User.findOne({ email });
		if (existinguser) {
			return res
				.status(400)
				.json({ message: 'User already exists', success: false });
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({ name, email, password: hashedPassword });

		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(refreshToken, user._id);

		setCookies(res, accessToken, refreshToken);

		// await newUser.save();
		return res.status(201).json({
			_id: user._id,
			name: user.name,
			//REMOVE THIS PASSOWRD IN DEPLOYMENT
			password: user.password,
			email: user.email,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error in Auth Controller' });
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		console.log(req.body);
		const existinguser = await User.findOne({ email }).select('+password');

		if (
			!existinguser ||
			!(await bcrypt.compare(password, existinguser.password))
		) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}
		// console.log("Generating Tokens! for User: ❌", email);

		const { accessToken, refreshToken } = generateTokens(existinguser._id);
		// console.log("Storing Tokens for ❌", email);
		await storeRefreshToken(refreshToken, existinguser._id);

		setCookies(res, accessToken, refreshToken);

		return res.status(200).json({
			message: 'Login successful',
			success: true,
			user: {
				_id: existinguser._id,
				name: existinguser.name,
				email: existinguser.email,
				createdAt: existinguser.createdAt,
				updatedAt: existinguser.updatedAt,
				__v: existinguser.__v,
			},
		});
	} catch (error) {
		console.error('Error in login Controller:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
			);
			await redis.del(`refresh_token:${decoded.userId}`);
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			return res
				.status(200)
				.json({ message: 'Logout successful', success: true });
		} else {
			return res.status(400).json({ message: 'No Refresh Token Found' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Error in Logging out' });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(400).json({ message: 'No Refresh Token Found' });
		}
		if (refreshToken) {
			const decoded = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
			);
			const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
			if (storedToken !== refreshToken) {
				return res.status(401).json({ message: 'Unauthorized' });
			}
			const accessToken = jwt.sign(
				{ userId: decoded.userId },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: '15m',
				},
			);

			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production' ? true : false,
				sameSite: 'strict',
				maxAge: 15 * 60 * 1000,
			});
			return res
				.status(200)
				.json({ accessToken, message: 'Token Refreshed Successfully' });
		}
	} catch (error) {
		console.log('Error in Refreshing Token', error);
		return res.status(500).json({ message: 'Error in Refreshing Token' });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
