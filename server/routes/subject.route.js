import express from 'express';
import {
	createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller.js';
import { ProtectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', ProtectRoute, createSubject);
router.get('/', ProtectRoute, getSubjects);
router.put('/:id', ProtectRoute, updateSubject);
router.delete('/:id', ProtectRoute, deleteSubject);

export default router;
