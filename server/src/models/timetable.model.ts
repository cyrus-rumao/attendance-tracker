import mongoose, { Schema, Document, Model } from 'mongoose';

/* ---------------- TYPES ---------------- */

export interface ITimetableSlot {
	subjectId: mongoose.Types.ObjectId;
	startTime: string; // "09:00"
	endTime: string; // "10:00"
}

export interface ITimetable extends Document {
	userId: mongoose.Types.ObjectId;

	monday: ITimetableSlot[];
	tuesday: ITimetableSlot[];
	wednesday: ITimetableSlot[];
	thursday: ITimetableSlot[];
	friday: ITimetableSlot[];
	saturday: ITimetableSlot[];

	createdAt: Date;
	updatedAt: Date;
}

/* ---------------- SCHEMAS ---------------- */

const slotSchema = new Schema<ITimetableSlot>(
	{
		subjectId: {
			type: Schema.Types.Mixed,
			ref: 'Subject',
			required: true,
		},
		startTime: {
			type: String,
			required: true,
		},
		endTime: {
			type: String,
			required: true,
		},
	},
	{ _id: false },
);

const timetableSchema = new Schema<ITimetable>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},

		monday: { type: [slotSchema], default: [] },
		tuesday: { type: [slotSchema], default: [] },
		wednesday: { type: [slotSchema], default: [] },
		thursday: { type: [slotSchema], default: [] },
		friday: { type: [slotSchema], default: [] },
		saturday: { type: [slotSchema], default: [] },
	},
	{ timestamps: true },
);

/* ---------------- MODEL ---------------- */

const Timetable: Model<ITimetable> = mongoose.model<ITimetable>(
	'Timetable',
	timetableSchema,
);

export default Timetable;
