import axios from 'axios';
import type {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../stores/useAuthStore';


interface RetryRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL as string,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});


let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetryRequestConfig | undefined;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				if (!refreshPromise) {
					refreshPromise = useAuthStore.getState().refreshToken();
				}

				await refreshPromise;
				refreshPromise = null;

				return api(originalRequest);
			} catch (refreshError) {
				refreshPromise = null;
				// useAuthStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
