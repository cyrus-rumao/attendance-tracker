import express from 'express';
import {
	markAttendance,
	getAttendanceByDate,
	deleteAttendance,
	getAttendanceSummary,
} from '../controllers/attendance.controller.js';
import { ProtectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', ProtectRoute, markAttendance);
router.get('/', ProtectRoute, getAttendanceByDate);
router.get('/summary', ProtectRoute, getAttendanceSummary);
router.delete('/:id', ProtectRoute, deleteAttendance);

export default router;
