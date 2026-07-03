import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, rateLimit, asyncHandler(controllerNotes.getAllNotes))
router.get('/:id', verificationAccessToken, rateLimit, asyncHandler(controllerNotes.getNote))
router.post('/', verificationAccessToken, rateLimit, asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationAccessToken, rateLimit, asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, rateLimit, asyncHandler(controllerNotes.deleteNote))

export default router;