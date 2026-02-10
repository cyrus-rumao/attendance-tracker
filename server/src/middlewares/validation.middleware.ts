import { Request, Response, NextFunction } from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validation.js';

export const signupValidation = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const result = signupSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: result.error.errors[0].message,
		});
	}

	req.body = result.data;
	next();
};

export const loginValidation = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const result = loginSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			message: result.error.errors[0].message,
		});
	}

	req.body = result.data;
	next();
};
