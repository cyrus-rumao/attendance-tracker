import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js';
import subjectRoutes from './routes/subject.route.js';
import timetableRoutes from './routes/timetable.route.js';
import attendanceRoutes from './routes/attendance.route.js';
dotenv.config();
const app = express();
app.use(
	cors({
		origin: true,
		credentials: true, // Allow cookies to be sent
	}),
);
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);

app.listen(process.env.PORT || 4000, () => {
	console.log(`Server is running on port ${process.env.PORT || 4000}`);
	connectDB();
});
