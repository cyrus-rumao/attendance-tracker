import { create } from 'zustand';
import axios from '../lib/axios';
import { notify } from '../lib/utils';
import {
	SubjectSchema,
	type Subject,
	type AddSubjectInput,
} from '../schemas/subject.schema';
import {
	SubjectDetailSchema,
	type SubjectDetail,
} from '../schemas/subject.schema';

interface SubjectState {
	subjects: Subject[];
	selectedSubject: SubjectDetail | null;
	loading: boolean;

	getSubjects: () => Promise<void>;
	addSubject: (subject: AddSubjectInput) => Promise<void>;
	getSubjectAnalytics: (id: string) => Promise<void>;
	clearSelectedSubject: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
	subjects: [],
	selectedSubject: null,
	loading: false,

	/* ---------------- GET ALL SUBJECTS ---------------- */

	getSubjects: async () => {
		try {
			set({ loading: true });

			const res = await axios.get('/subjects');

			const parsed = res.data.map((s: unknown) => SubjectSchema.parse(s));

			set({
				subjects: parsed,
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to fetch subjects');
		}
	},

	/* ---------------- ADD SUBJECT ---------------- */

	addSubject: async (subject) => {
		try {
			set({ loading: true });

			const res = await axios.post('/subjects', subject);

			const parsed = SubjectSchema.parse(res.data);

			set({
				subjects: [...get().subjects, parsed],
				loading: false,
			});

			notify.success('Subject added successfully');
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to add subject');
		}
	},

	/* ---------------- GET SUBJECT ANALYTICS ---------------- */

	getSubjectAnalytics: async (id: string) => {
		try {
			set({ loading: true });

			const res = await axios.get(`/subjects/${id}`);

			const parsed = SubjectDetailSchema.parse(res.data);

			set({
				selectedSubject: parsed,
				loading: false,
			});
		} catch (error) {
			set({ loading: false });
			notify.error('Failed to fetch subject details');
		}
	},

	/* ---------------- CLEAR ---------------- */

	clearSelectedSubject: () => {
		set({ selectedSubject: null });
	},
}));
