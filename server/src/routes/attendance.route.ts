import express from 'express';
import {
	markAttendance,
	getAttendanceByDate,
	deleteAttendance,
	getAttendanceSummary,
} from '../controllers/attendance.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, markAttendance);
router.get('/', protectRoute, getAttendanceByDate);
router.get('/summary', protectRoute, getAttendanceSummary);
router.delete('/:id', protectRoute, deleteAttendance);

export default router;
