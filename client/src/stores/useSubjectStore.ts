import { create } from 'zustand';
import axios from '../lib/axios';
import type { Subject, AddSubjectInput } from '../schemas/subject.schema.ts';
// import { toast } from 'react-hot-toast';
import { notify } from '../lib/utils';

interface SubjectState {
	subjects: Subject[];
	loading: boolean;
	getSubjects: () => Promise<void>;
	addSubject: (subject: AddSubjectInput) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
	subjects: [],
	loading: false,

	getSubjects: async () => {
		try {
			set({ loading: true });
			const res = await axios.get<Subject[]>('/subjects');
			set({
				subjects: res.data,
				loading: false,
			});
		} catch (error: unknown) {
			set({ loading: false });
			notify.error('Failed to fetch subjects');
		}
	},

	addSubject: async (subject) => {
		try {
			set({ loading: true });
			const res = await axios.post<Subject>('/subjects', subject);
			set({
				subjects: [...get().subjects, res.data],
				loading: false,
			});
			notify.success('Subject added successfully');
		} catch (error: unknown) {
			set({ loading: false });
			notify.error('Failed to add subject');
		}
	},
}));
