import Attendance from '../models/attendance.model.js';
import Subject from '../models/subject.model.js';
import Timetable from '../models/timetable.model.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

/* ---------------- HELPERS ---------------- */

const calculateDuration = (start: string, end: string): number => {
	const [sh, sm] = start.split(':').map(Number);
	const [eh, em] = end.split(':').map(Number);

	return (eh * 60 + em - (sh * 60 + sm)) / 60;
};

const getDayFromDate = (date: string): string => {
	return new Date(date)
		.toLocaleDateString('en-US', { weekday: 'long' })
		.toLowerCase();
};

/* ---------------- CONTROLLERS ---------------- */

export const markAttendance = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const userId = req.user._id;
		const { subjectId, date, startTime, endTime, status } = req.body;

		if (!mongoose.Types.ObjectId.isValid(subjectId)) {
			return res.status(400).json({ message: 'Invalid subjectId' });
		}

		const today = new Date().toISOString().split('T')[0];
		if (date > today) {
			return res.status(400).json({ message: 'Cannot mark future attendance' });
		}

		const subject = await Subject.findOne({ _id: subjectId, userId });
		if (!subject) {
			return res.status(404).json({ message: 'Invalid subject' });
		}

		/* ----- Validate against timetable ----- */

		const timetable = await Timetable.findOne({ userId });
		if (!timetable) {
			return res.status(400).json({ message: 'No timetable found' });
		}

		const day = getDayFromDate(date);

		const daySlots = (timetable as any)[day] || [];

		const matchingSlot = daySlots.find(
			(slot: any) =>
				slot.subjectId.toString() === subjectId &&
				slot.startTime === startTime &&
				slot.endTime === endTime,
		);

		if (!matchingSlot) {
			return res.status(400).json({
				message: 'Slot does not exist in timetable',
			});
		}

		/* ----- Calculate hours dynamically ----- */

		const hours = calculateDuration(startTime, endTime);

		const attendance = await Attendance.create({
			userId,
			subjectId,
			date,
			startTime,
			endTime,
			status,
			hours,
		});

		return res.status(201).json(attendance);
	} catch (error: any) {
		if (error.code === 11000) {
			return res.status(400).json({
				message: 'Attendance already marked for this slot',
			});
		}

		console.error(error);
		return res.status(500).json({ message: 'Failed to mark attendance' });
	}
};

export const getAttendanceByDate = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const userId = req.user._id;
	const { date } = req.query;

	if (typeof date !== 'string') {
		return res.status(400).json({ message: 'Invalid date' });
	}

	const attendance = await Attendance.find({ userId, date }).populate(
		'subjectId',
		'name code type',
	);

	return res.json(attendance);
};

export const deleteAttendance = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const userId = req.user._id;
	const { id } = req.params;

	if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid id' });
	}

	const record = await Attendance.findOneAndDelete({
		_id: id,
		userId,
	});

	if (!record) {
		return res.status(404).json({ message: 'Attendance not found' });
	}

	return res.json({ message: 'Attendance deleted' });
};

export const getAttendanceSummary = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const userId = req.user._id;

	const records = await Attendance.find({
		userId,
		status: { $ne: 'cancelled' },
	}).populate('subjectId', 'name code type');
console.log(records)
	if (records.length === 0) {
		return res.status(404).json({ message: 'No records Found' });
	}
	const summary: Record<
		string,
		{
			subject: any;
			attended: number;
			total: number;
			percentage: number;
		}
	> = {};

	records.forEach((r: any) => {
		const id = r.subjectId._id.toString();

		if (!summary[id]) {
			summary[id] = {
				subject: r.subjectId,
				attended: 0,
				total: 0,
				percentage: 0,
			};
		}

		summary[id].total += r.hours;

		if (r.status === 'present') {
			summary[id].attended += r.hours;
		}
	});

	Object.values(summary).forEach((s) => {
		s.percentage = s.total ? Math.round((s.attended / s.total) * 100) : 0;
	});

	return res.json(Object.values(summary));
};
