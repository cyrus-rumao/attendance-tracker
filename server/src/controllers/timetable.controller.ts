import Timetable from '../models/timetable.model.js';
import Subject from '../models/subject.model.js';
import {Request, Response} from 'express';
/* ---------------- HELPERS ---------------- */

const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];

// normalize missing days to empty arrays
const normalizeTimetable = (data) => {
	const normalized = {};
	DAYS.forEach((day) => {
		normalized[day] = Array.isArray(data[day]) ? data[day] : [];
	});
	return normalized;
};

// check overlapping slots in a single day
const hasOverlap = (slots) => {
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


export const saveTimetable = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;

		// normalize timetable structure
		const timetableData = normalizeTimetable(req.body);
		const subjectIds = [];

		Object.values(timetableData).forEach((daySlots) => {
			daySlots.forEach((slot) => {
				subjectIds.push(slot.subjectId);
			});
		});

		const uniqueSubjectIds = [...new Set(subjectIds)];

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
		res.json(timetable);
	} catch (error) {
		console.error('Save timetable error:', error);
		res.status(500).json({ message: 'Failed to save timetable' });
	}
};

export const getTimetable = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		const timetable = await Timetable.findOne({ userId })
		.populate("monday.subjectId")
		.populate("tuesday.subjectId")
		.populate("wednesday.subjectId")
		.populate("thursday.subjectId")
		.populate("friday.subjectId")
		.populate("saturday.subjectId");
// 
		if (!timetable) {
			return res.status(404).json({ message: 'Timetable not found' });
		}

		res.json(timetable);
	} catch (error) {
		console.error('Get timetable error:', error);
		res.status(500).json({ message: 'Failed to get timetable' });
	}
};

export const deleteTimetable = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;

		const timetable = await Timetable.findOneAndDelete({ userId });

		if (!timetable) {
			return res.status(404).json({ message: 'Timetable not found' });
		}

		res.json({ message: 'Timetable deleted successfully' });
	} catch (error) {
		console.error('Delete timetable error:', error);
		res.status(500).json({ message: 'Failed to delete timetable' });
	}
};
