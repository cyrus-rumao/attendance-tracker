import mongoose from 'mongoose';
export const connectDB = async () => {
	try {
		await mongoose.connect(String(process.env.MONGO_URI));
		console.log('✅ Database Connected ✅');
	} catch (error) {
		console.log('❌ Database Connection Failed ❌');
		console.log(error);
		process.exit(1);
	}
};
