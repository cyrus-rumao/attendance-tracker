import { z } from 'zod';

export const signupSchema = z
	.object({
		name: z.string().min(3).max(30),
		email: z.email(),
		password: z.string().min(6).max(20),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(20),
});
