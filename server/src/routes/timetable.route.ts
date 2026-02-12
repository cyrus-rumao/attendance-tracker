import {Router} from 'express';
import {
	saveTimetable,
	getTimetable,
	deleteTimetable,
	// editTimetable
} from '../controllers/timetable.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protectRoute, saveTimetable);
router.get('/', protectRoute, getTimetable);
router.delete('/', protectRoute, deleteTimetable);
export default router;
