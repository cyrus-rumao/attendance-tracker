import Subject from '../models/subject.model.js';
import Timetable, { ITimetableSlot } from '../models/timetable.model.js';
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
