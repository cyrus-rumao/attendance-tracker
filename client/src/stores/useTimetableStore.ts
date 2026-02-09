import { create } from 'zustand';
import { AxiosError } from 'axios';
import axios from '../lib/axios';
import { notify } from '../lib/utils';
import { z } from 'zod';
import {
	TimetableSchema,
	TimetableSlotSchema,
	type Timetable,
	type TimetableSlot,
} from '../schemas/timetable.schema';

// ---------- STORE TYPE ----------
interface TimetableStore {
	timetable: Timetable | null;
	loading: boolean;

	getTimetable: () => Promise<Timetable | null>;
	saveTimetable: (timetableData: Timetable) => Promise<boolean>;
	deleteTimetable: () => Promise<boolean>;
	updateDay: (day: keyof Timetable, slots: TimetableSlot[]) => void;
	resetTimetable: () => void;
}

// ---------- STORE ----------
export const useTimetableStore = create<TimetableStore>((set, get) => ({
	timetable: null,
	loading: false,

	// ---------- GET TIMETABLE ----------
	getTimetable: async () => {
		set({ loading: true });

		try {
			const res = await axios.get('/timetable');

			// 🔐 validate API response
			const parsed = TimetableSchema.parse(res.data);

			set({ timetable: parsed, loading: false });
			return parsed;
		} catch (error: unknown) {
			set({ timetable: null, loading: false });

			const err = error as AxiosError;
			if (err.response?.status !== 404) {
				notify.error('Failed to fetch timetable');
			}
			return null;
		}
	},

	// ---------- SAVE / EDIT TIMETABLE ----------
	saveTimetable: async (timetableData) => {
		set({ loading: true });

		try {
			// 🔐 validate before sending
			const validated = TimetableSchema.parse(timetableData);

			const res = await axios.put('/timetable', validated);

			// 🔐 validate response too
			const parsed = TimetableSchema.parse(res.data);

			set({ timetable: parsed, loading: false });
			notify.success('Timetable saved');
			return true;
			} catch (error: unknown) {
			const err = error as AxiosError<{ message?: string }>;
			notify.error(err.response?.data?.message || 'Failed to save timetable');
			set({ loading: false });
			return false;
		}
	},

	// ---------- DELETE TIMETABLE ----------
	deleteTimetable: async () => {
		set({ loading: true });

		try {
			await axios.delete('/timetable');
			set({ timetable: null, loading: false });
			notify.success('Timetable deleted');
			return true;
		} catch (error: unknown) {
			const err = error as AxiosError<{ message?: string }>;
			notify.error(err.response?.data?.message || 'Failed to delete timetable');
			set({ loading: false });
			return false;
		}
	},

	// ---------- LOCAL UPDATE (UI ONLY) ----------
	updateDay: (day, slots) => {
		const timetable = get().timetable;
		if (!timetable) return;

		// 🔐 validate UI input
    const parsedSlots = z.array(TimetableSlotSchema).safeParse(slots);
    //parse -> throws error everything stops
    //safeparse -> throws error in object form but doesnt stop everything
		if (!parsedSlots.success) {
			notify.error('Invalid timetable slot data');
			return;
		}

		set({
			timetable: {
				...timetable,
				[day]: parsedSlots.data,
			},
		});
	},

	// ---------- RESET ----------
	resetTimetable: () => {
		set({ timetable: null });
	},
}));
