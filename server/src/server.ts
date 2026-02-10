console.log('🔥 SERVER BOOT');

import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import subjectRoutes from './routes/subject.route.js';
import timetableRoutes from './routes/timetable.route.js';
import attendanceRoutes from './routes/attendance.route.js';
import { connectDB } from './config/db.js';

const app: Application = express();

app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
	res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, async () => {
	console.log(`🚀 Server running on port ${PORT}`);
	await connectDB();
});
