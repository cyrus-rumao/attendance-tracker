import express from 'express';
import {
	saveTimetable,
  getTimetable,
  deleteTimetable,
  // editTimetable
} from '../controllers/timetable.controller.js';
import { ProtectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', ProtectRoute, saveTimetable);
router.get('/', ProtectRoute, getTimetable);
router.delete('/', ProtectRoute, deleteTimetable);
export default router;
