import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, asyncHandler(controllerNotes.getAllNotes))
router.get('/:id', verificationToken, asyncHandler(controllerNotes.getNote))
router.post('/', verificationToken, asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationToken, asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationToken, asyncHandler(controllerNotes.deleteNote))

export default router;