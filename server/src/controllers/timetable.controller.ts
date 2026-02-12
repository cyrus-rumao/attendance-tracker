import Timetable, { ITimetableSlot } from '../models/timetable.model.js';
import Subject from '../models/subject.model.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

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

/* ---------------- HELPERS ---------------- */

// normalize missing days to empty arrays
const normalizeTimetable = (
	data: Partial<Record<Day, ITimetableSlot[]>>,
): Record<Day, ITimetableSlot[]> => {
	const normalized = {} as Record<Day, ITimetableSlot[]>;

	DAYS.forEach((day) => {
		normalized[day] = Array.isArray(data?.[day]) ? data[day]! : [];
	});

	return normalized;
};

// check overlapping slots in a single day
const hasOverlap = (slots: ITimetableSlot[]): boolean => {
	const times = slots
		.map((s) => ({
			start: Number(s.startTime.replace(':', '')),
			end: Number(s.endTime.replace(':', '')),
		}))
		.sort((a, b) => a.start - b.start);

	for (let i = 0; i < times.length - 1; i++) {
		if (times[i].end > times[i + 1].start) {
			return true;
		}
	}
	return false;
};

/* ---------------- CONTROLLERS ---------------- */

export const saveTimetable = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const userId = req.user._id;

		const timetableData = normalizeTimetable(req.body);

		const subjectIds: mongoose.Types.ObjectId[] = [];

		DAYS.forEach((day) => {
			timetableData[day].forEach((slot) => {
				subjectIds.push(new mongoose.Types.ObjectId(slot.subjectId));
			});
		});

		const uniqueSubjectIds = [...new Set(subjectIds.map(String))].map(
			(id) => new mongoose.Types.ObjectId(id),
		);

		const validSubjects = await Subject.find({
			_id: { $in: uniqueSubjectIds },
			userId,
		}).select('_id');

		if (validSubjects.length !== uniqueSubjectIds.length) {
			return res.status(400).json({
				message: 'Invalid subjectId found in timetable',
			});
		}

		for (const day of DAYS) {
			if (hasOverlap(timetableData[day])) {
				return res.status(400).json({
					message: `Overlapping time slots detected on ${day}`,
				});
			}
		}

		const timetable = await Timetable.findOneAndUpdate(
			{ userId },
			{ ...timetableData, userId },
			{ upsert: true, new: true },
		);

		return res.json(timetable);
	} catch (error) {
		console.error('Save timetable error:', error);
		return res.status(500).json({
			message: 'Failed to save timetable',
		});
	}
};

export const getTimetable = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const userId = req.user._id;

		const timetable = await Timetable.findOne({ userId })
			.populate('monday.subjectId')
			.populate('tuesday.subjectId')
			.populate('wednesday.subjectId')
			.populate('thursday.subjectId')
			.populate('friday.subjectId')
			.populate('saturday.subjectId');

		if (!timetable) {
			return res.status(404).json({ message: 'Timetable not found' });
		}

		return res.json(timetable);
	} catch (error) {
		console.error('Get timetable error:', error);
		return res.status(500).json({
			message: 'Failed to get timetable',
		});
	}
};

export const deleteTimetable = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const userId = req.user._id;

		const timetable = await Timetable.findOneAndDelete({
			userId,
		});

		if (!timetable) {
			return res.status(404).json({ message: 'Timetable not found' });
		}

		return res.json({
			message: 'Timetable deleted successfully',
		});
	} catch (error) {
		console.error('Delete timetable error:', error);
		return res.status(500).json({
			message: 'Failed to delete timetable',
		});
	}
};
