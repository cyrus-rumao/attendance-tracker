import Attendance from '../models/attendance.model.js';
import Subject from '../models/subject.model.js';
import { Request, Response } from 'express';
export const markAttendance = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		const { subjectId, date, startTime, endTime, status } = req.body;

		const today = new Date().toISOString().split('T')[0];
		if (date > today) {
			return res.status(400).json({ message: 'Cannot mark future attendance' });
		}

		const subject = await Subject.findOne({ _id: subjectId, userId });
		if (!subject) {
			return res.status(404).json({ message: 'Invalid subject' });
		}

		const hours = subject.type === 'lab' ? 2 : 1;

		const attendance = await Attendance.create({
			userId,
			subjectId,
			date,
			startTime,
			endTime,
			status,
			hours: status === 'present' ? hours : 0,
		});

		res.status(201).json(attendance);
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({
				message: 'Attendance already marked for this slot',
			});
		}

		console.error(error);
		res.status(500).json({ message: 'Failed to mark attendance' });
	}
};

export const getAttendanceByDate = async (req: Request, res: Response) => {
	const userId = req.user._id;
	const { date } = req.query;

	const attendance = await Attendance.find({ userId, date }).populate(
		'subjectId',
		'name code type',
	);

	res.json(attendance);
};

export const deleteAttendance = async (req: Request, res: Response) => {
	const userId = req.user._id;
	const { id } = req.params;

	const record = await Attendance.findOneAndDelete({ _id: id, userId });
	if (!record) {
		return res.status(404).json({ message: 'Attendance not found' });
	}

	res.json({ message: 'Attendance deleted' });
};

export const getAttendanceSummary = async (req: Request, res: Response) => {
	const userId = req.user._id;

	const records = await Attendance.find({
		userId,
		status: { $ne: 'cancelled' },
	}).populate('subjectId', 'name code type');

	const summary = {};

	records.forEach((r) => {
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

	res.json(Object.values(summary));
};
