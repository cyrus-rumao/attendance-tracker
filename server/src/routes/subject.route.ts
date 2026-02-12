import {Router} from 'express';
import {
	createSubject,
	getSubjects,
	updateSubject,
	deleteSubject,
} from '../controllers/subject.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protectRoute, createSubject);
router.get('/', protectRoute, getSubjects);
router.put('/:id', protectRoute, updateSubject);
router.delete('/:id', protectRoute, deleteSubject);

export default router;
