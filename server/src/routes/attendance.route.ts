import { Router } from 'express';
import {
	markAttendance,
	getAttendanceByDate,
	deleteAttendance,
	getAttendanceSummary,
} from '../controllers/attendance.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protectRoute, markAttendance);
router.get('/', protectRoute, getAttendanceByDate);
router.get('/summary', protectRoute, getAttendanceSummary);
router.delete('/:id', protectRoute, deleteAttendance);
router.get('/summary', protectRoute, getAttendanceSummary);
export default router;
