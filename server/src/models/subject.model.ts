import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			uppercase: true,
		},
		code: {
			type: String,
		},

		type: {
			type: String,
			enum: ['lecture', 'lab'],
			default: 'lecture',
		},
	},
	{ timestamps: true },
);

export default mongoose.model('Subject', subjectSchema);
