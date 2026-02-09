import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		subjectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
		},

		date: {
			type: String, // YYYY-MM-DD
			required: true,
			index: true,
		},

		startTime: {
			type: String, // "09:00"
			required: true,
		},

		endTime: {
			type: String, // "10:00"
			required: true,
		},

		hours: {
			type: Number, // 1 or 2 (labs)
			required: true,
		},

		status: {
			type: String,
			enum: ['present', 'absent', 'bunked', 'cancelled'],
			required: true,
		},
	},
	{ timestamps: true },
);

// Prevent double marking
attendanceSchema.index(
	{ userId: 1, subjectId: 1, date: 1, startTime: 1 },
	{ unique: true },
);

export default mongoose.model('Attendance', attendanceSchema);
