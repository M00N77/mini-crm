import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationToken, rateLimit, asyncHandler(controllerNotes.getAllNotes))
router.get('/:id', verificationToken, rateLimit, asyncHandler(controllerNotes.getNote))
router.post('/', verificationToken, rateLimit, asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationToken, rateLimit, asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationToken, rateLimit, asyncHandler(controllerNotes.deleteNote))

export default router;