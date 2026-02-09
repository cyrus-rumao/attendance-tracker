import { create } from 'zustand';
import axios from '../lib/axios';
import { notify } from '../lib/utils';

// ---------- TYPES ----------
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
	refreshToken: () => Promise<void>;
}

// ---------- STORE ----------
export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	// ---------- SIGNUP ----------
	signup: async (data) => {
		set({ loading: true });
		const paresedInput = SignupInputSchema.safeParse(data);
		console.log('Parsed input:', paresedInput);
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

	// ---------- LOGIN ----------
	login: async (data) => {
		// console.log('Data: ', data);
		set({ loading: true });
		const parsedInput = LoginInputSchema.safeParse(data);
		// console.log('parsed input: ', parsedInput.data);
		if (!parsedInput.success) {
			set({ loading: false });
			notify.error('Invalid login data');
			return false;
		}
		try {
			const res = await axios.post('/auth/login', parsedInput.data);
			const user = UserSchema.parse(res.data.user);
			console.log('Setting user in login()', user);
			set({ user, loading: false });
			notify.success('Login successful');
			return true;
		} catch (error: any) {
			console.log('hahaha');
			// const err = error as AxiosError<{ message?: string }>;
			notify.error(error.response?.data?.message || 'Login failed');
			set({ loading: false });
			return false;
		}
	},

	// ---------- LOGOUT ----------
	logout: async (silent = false) => {
		try {
			await axios.post('/auth/logout');
		} catch (e) {
			if (!silent) notify.error('Logout error');
		} finally {
			set({ user: null });
		}
	},

	// ---------- CHECK AUTH ----------
	checkAuth: async () => {
		if (get().user) {
			set({ checkingAuth: false });
			return;
		}

		set({ checkingAuth: true });
		try {
			const res = await axios.get('/auth/profile');
			const user = UserSchema.parse(res.data);
			set({ user, checkingAuth: false });
		} catch {
			set({ checkingAuth: false });
		}
	},

	// ---------- REFRESH TOKEN ----------
	refreshToken: async () => {
		// if (get().checkingAuth) return;

		// set({ checkingAuth: true });

		await axios.post('/auth/refresh-token');
	},
}));
