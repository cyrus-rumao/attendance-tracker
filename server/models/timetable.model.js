import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
	{
		subjectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
		},
		startTime: String, // "09:00"
		endTime: String, // "10:00"
	},
	{ _id: false },
);

const timetableSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},

		monday: [slotSchema],
		tuesday: [slotSchema],
		wednesday: [slotSchema],
		thursday: [slotSchema],
		friday: [slotSchema],
		saturday: [slotSchema],
	},
	{ timestamps: true },
);

export default mongoose.model('Timetable', timetableSchema);
