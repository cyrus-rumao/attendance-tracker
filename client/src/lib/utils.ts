import { toast } from 'sonner';
type ToastMessage = string;

export const notify = {
	success: (msg: ToastMessage) =>
		toast.success(msg, { position: 'top-center', duration: 5000 }),

	error: (msg: ToastMessage) =>
		toast.error(msg, { position: 'top-center', duration: 5000 }),
};
