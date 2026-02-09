import { z } from 'zod';
export const UserSchema = z.object({
	_id: z.string(),
	name: z.string(),
	email: z.email(),
	createdAt: z.string(),
	updatedAt: z.string(),
	__v: z.number(),
});

export type User = z.infer<typeof UserSchema>;

export const SignupInputSchema = z
	.object({
		name: z.string().min(2),
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});
export type SignupInput = z.infer<typeof SignupInputSchema>;

export const LoginInputSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
