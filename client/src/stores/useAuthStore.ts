import { create } from 'zustand';
import axios from '../lib/axios';
import { notify } from '../lib/utils';

import {
	UserSchema,
	SignupInputSchema,
	LoginInputSchema,
	type User,
	type SignupInput,
	type LoginInput,
} from '../schemas/user.schema';
import type { AxiosError } from 'axios';

interface AuthStore {
	user: User | null;
	loading: boolean;
	checkingAuth: boolean;

	signup: (data: SignupInput) => Promise<boolean>;
	login: (data: LoginInput) => Promise<boolean>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async (data) => {
		set({ loading: true });
		const paresedInput = SignupInputSchema.safeParse(data);
		console.log('Parsed input:', paresedInput.data);
		if (!paresedInput.success) {
			set({ loading: false });
			notify.error('Invalid signup data');
			return false;
		}

		try {
			const res = await axios.post('/auth/signup', paresedInput.data);
			const user = UserSchema.parse(res.data);
			set({ user: user, loading: false });
			notify.success('Signup successful');
			return true;
		} catch (error: unknown) {
			const err = error as AxiosError<{ message?: string }>;
			notify.error(err.response?.data?.message || 'Signup failed');
			set({ loading: false });
			return false;
		}
	},

	login: async (data) => {
		// console.log('Data: ', data);
		set({ loading: true });
		const parsedInput = LoginInputSchema.safeParse(data);
		if (!parsedInput.success) {
			set({ loading: false });
			notify.error('Invalid login data');
			return false;
		}
		try {
			const res = await axios.post('/auth/login', parsedInput.data);
			if (!res.data.user) {
				set({ loading: false });
				notify.error('Login response missing user');
				return false;
			}
			const user = UserSchema.parse(res.data.user);

			console.log('Setting user in login()', user);
			set({ user, loading: false });
			notify.success('Login successful');
			return true;
		} catch (error: any) {
			console.log('Error: ', error);
			console.log('hahaha');
			// const err = error as AxiosError<{ message?: string }>;
			notify.error(error.response?.data?.message || 'Login failed');
			set({ loading: false });
			return false;
		}
	},

	logout: async () => {
		await axios.post('/auth/logout');
		set({ user: null });
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const res = await axios.get('/auth/profile');
			const user = UserSchema.parse(res.data);
			set({ user, checkingAuth: false });
		} catch {
			set({ user: null, checkingAuth: false });
		}
	},
}));
