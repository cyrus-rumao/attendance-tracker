import Subject from '../models/subject.model.js';
import Timetable, { ITimetableSlot } from '../models/timetable.model.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/attendance.model.js';
/* ---------------- CONSTANTS ---------------- */

const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
] as const;

type Day = (typeof DAYS)[number];

/* ---------------- CONTROLLERS ---------------- */

export const createSubject = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user!._id;

		const subject = await Subject.create({
			userId,
			...req.body,
		});

		return res.status(201).json(subject);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to create subject' });
	}
};

export const getSubjects = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user!._id;

		const subjects = await Subject.find({ userId });

		return res.json(subjects);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Failed to fetch subjects' });
	}
};

export const updateSubject = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user!._id;
		const { id } = req.params;

		if (Array.isArray(id)) {
			return res.status(400).json({ message: 'Invalid subject id' });
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid subject id' });
		}


		const subject = await Subject.findOneAndUpdate(
			{ _id: id, userId },
			req.body,
			{ new: true },
		);

		if (!subject) {
			return res.status(404).json({ message: 'Subject not found' });
		}

		return res.json(subject);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to update subject' });
	}
};

export const deleteSubject = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user!._id;
		const { id } = req.params;

		if (Array.isArray(id)) {
			return res.status(400).json({ message: 'Invalid subject id' });
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid subject id' });
		}

		// Delete subject (must belong to user)
		const subject = await Subject.findOneAndDelete({
			_id: id,
			userId,
		});

		if (!subject) {
			return res.status(404).json({ message: 'Subject not found' });
		}

		// Remove subject from timetable slots
		const timetable = await Timetable.findOne({ userId });

		if (timetable) {
			DAYS.forEach((day: Day) => {
				timetable[day] = timetable[day].filter(
					(slot: ITimetableSlot) => slot.subjectId.toString() !== id,
				);
			});

			await timetable.save();
		}

		return res.json({
			message: 'Subject deleted and removed from timetable',
		});
	} catch (error) {
		console.error('Delete subject error:', error);
		return res.status(500).json({ message: 'Failed to delete subject' });
	}
};
export const getFullSubjectAnalytics = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const userId = req.user._id;
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid subject id' });
		}

		const subject = await Subject.findOne({ _id: id, userId });

		if (!subject) {
			return res.status(404).json({ message: 'Subject not found' });
		}

		/* ---------- Attendance Records ---------- */

		const records = await Attendance.find({
			userId,
			subjectId: id,
			status: { $ne: 'cancelled' },
		});

		let totalConducted = 0;
		let attended = 0;
		let absent = 0;
		let bunked = 0;

		records.forEach((r: any) => {
			totalConducted += r.hours;

			if (r.status === 'present') attended += r.hours;
			if (r.status === 'absent') absent += r.hours;
			if (r.status === 'bunked') bunked += r.hours;
		});

		const percentage =
			totalConducted > 0 ? Math.round((attended / totalConducted) * 100) : 0;

		/* ---------- Timetable Scheduled Weekly Hours ---------- */

		const timetable = await Timetable.findOne({ userId });

		let weeklyScheduledHours = 0;

		if (timetable) {
			const DAYS = [
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
			];

			DAYS.forEach((day) => {
				const slots = (timetable as any)[day] || [];

				slots.forEach((slot: any) => {
					if (slot.subjectId.toString() === id) {
						const [sh, sm] = slot.startTime.split(':').map(Number);
						const [eh, em] = slot.endTime.split(':').map(Number);

						const duration = (eh * 60 + em - (sh * 60 + sm)) / 60;

						weeklyScheduledHours += duration;
					}
				});
			});
		}

		/* ---------- 75% Safety Calculations ---------- */

		const minRequired = Math.ceil(totalConducted * 0.75);

		const safeBunks =
			percentage >= 75 ? Math.floor(attended - 0.75 * totalConducted) : 0;

		const hoursNeededToReach75 =
			percentage < 75
				? Math.ceil((0.75 * totalConducted - attended) / 0.25)
				: 0;

		return res.json({
			subject,
			analytics: {
				totalConductedHours: totalConducted,
				attendedHours: attended,
				absentHours: absent,
				bunkedHours: bunked,
				attendancePercentage: percentage,
				weeklyScheduledHours,
				minimumRequiredFor75Percent: minRequired,
				safeBunkHours: safeBunks,
				hoursNeededToReach75Percent: hoursNeededToReach75,
			},
		});
	} catch (error) {
		console.error('Subject analytics error:', error);
		return res
			.status(500)
			.json({ message: 'Failed to fetch subject analytics' });
	}
};
