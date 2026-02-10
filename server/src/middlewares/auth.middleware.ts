import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model.js';

interface AccessTokenPayload extends JwtPayload {
	userId: string;
}

export const protectRoute = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<Response | void> => {
	try {
		const accessToken = req.cookies?.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: 'Unauthenticated' });
		}

		try {
			const decoded = jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET as string,
			) as AccessTokenPayload;

			const user = await User.findById(decoded.userId).select('-password');

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			req.user = user;
			next();
		} catch (error: any) {
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Token Expired' });
			}
			return res.status(401).json({ message: 'Invalid Access Token' });
		}
	} catch (error) {
		console.error('Error in Protect Route:', error);
		return res.status(500).json({ message: 'Unauthorized' });
	}
};

// export const adminRoute = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction,
// ): Response | void => {
// 	try {
// 		if (req.user && req.user.role === 'admin') {
// 			return next();
// 		}

// 		return res.status(403).json({ message: 'Forbidden! Admin Access Only' });
// 	} catch (error) {
// 		console.error('Error in Admin Route:', error);
// 		return res.status(500).json({ message: 'Unauthorized' });
// 	}
// };
