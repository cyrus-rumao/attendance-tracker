import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from '../config/redis.js';
import { Request, Response } from 'express';

interface TokenPayload extends JwtPayload {
	userId: string;
}

const generateTokens = (userId: string) => {
	const accessToken = jwt.sign(
		{ userId },
		process.env.ACCESS_TOKEN_SECRET as string,
		{ expiresIn: '15m' },
	);

	const refreshToken = jwt.sign(
		{ userId },
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: '7d' },
	);

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (
	refreshToken: string,
	userId: string,
): Promise<void> => {
	const user = await User.findById(userId).select('email');
	if (!user) return;

	await redis.hset(
		`refresh_token:${userId}`,
		'token',
		refreshToken,
		'email',
		user.email,
	);

	await redis.expire(`refresh_token:${userId}`, 7 * 24 * 60 * 60);
};

const setCookies = (
	res: Response,
	accessToken: string,
	refreshToken: string,
): void => {
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 15 * 60 * 1000,
	});

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const signup = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	const { name, email, password } = req.body; // Zod already validated

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });

		const { accessToken, refreshToken } = generateTokens(user._id.toString());
		await storeRefreshToken(refreshToken, user._id.toString());
		setCookies(res, accessToken, refreshToken);

		return res.status(201).json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error in Signup' });
	}
};

export const login = async (req: Request, res: Response): Promise<Response> => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const { accessToken, refreshToken } = generateTokens(user._id.toString());
		await storeRefreshToken(refreshToken, user._id.toString());
		setCookies(res, accessToken, refreshToken);

		return res.status(200).json({
			success: true,
			message: 'Login successful',
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Login failed' });
	}
};

export const logout = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return res.status(400).json({ message: 'No Refresh Token Found' });
		}

		const decoded = jwt.verify(
			token,
			process.env.REFRESH_TOKEN_SECRET as string,
		) as TokenPayload;

		await redis.del(`refresh_token:${decoded.userId}`);

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		return res.status(200).json({ success: true });
	} catch {
		return res.status(500).json({ message: 'Logout failed' });
	}
};

export const refreshToken = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return res.status(400).json({ message: 'No Refresh Token Found' });
		}

		const decoded = jwt.verify(
			token,
			process.env.REFRESH_TOKEN_SECRET as string,
		) as TokenPayload;

		const storedToken = await redis.hget(
			`refresh_token:${decoded.userId}`,
			'token',
		);

		if (storedToken !== token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const accessToken = jwt.sign(
			{ userId: decoded.userId },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '15m' },
		);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000,
		});

		return res.status(200).json({ success: true });
	} catch {
		return res.status(500).json({ message: 'Token refresh failed' });
	}
};

export const getProfile = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	return res.status(200).json(req.user);
};
