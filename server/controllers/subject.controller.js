import Subject from '../models/subject.model.js';
import Timetable from '../models/timetable.model.js';
export const createSubject = async (req, res) => {
	try {
		console.log('User ', req.user);
		const subject = await Subject.create({
			userId: req.user._id,
			...req.body,
		});

		res.status(201).json(subject);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Failed to create subject' });
	}
};

export const getSubjects = async (req, res) => {
	const subjects = await Subject.find({ userId: req.user._id });
	res.json(subjects);
};

export const updateSubject = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id } = req.params;

		const subject = await Subject.findOneAndUpdate(
			{ _id: id, userId },
			req.body,
			{ new: true },
		);

		if (!subject) {
			return res.status(404).json({ message: 'Subject not found' });
		}

		res.json(subject);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to update subject' });
	}
};
const DAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];

export const deleteSubject = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: subjectId } = req.params;

		// Delete subject (must belong to user)
		const subject = await Subject.findOneAndDelete({
			_id: subjectId,
			userId,
		});

		if (!subject) {
			return res.status(404).json({ message: 'Subject not found' });
		}

		// Remove subject from timetable slots
		const timetable = await Timetable.findOne({ userId });

		if (timetable) {
			DAYS.forEach((day) => {
				timetable[day] = timetable[day].filter(
					(slot) => slot.subjectId.toString() !== subjectId,
				);
			});

			await timetable.save();
		}

		res.json({
			message: 'Subject deleted and removed from timetable',
		});
	} catch (error) {
		console.error('Delete subject error:', error);
		res.status(500).json({ message: 'Failed to delete subject' });
	}
};
