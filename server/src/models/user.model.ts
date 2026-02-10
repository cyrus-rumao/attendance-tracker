import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	rollNo?: string;
	semester?: number;
	timetableId?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},

		rollNo: {
			type: String,
			trim: true,
		},

		semester: {
			type: Number,
			// required: true,
		},

		timetableId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Timetable',
		},
	},
	{
		timestamps: true,
	},
);

const User:Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
