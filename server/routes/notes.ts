import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(controllerNotes.getAllNotes))
router.get('/:id', verificationAccessToken, asyncHandler(controllerNotes.getNote))
router.post('/', verificationAccessToken, asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationAccessToken, asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, asyncHandler(controllerNotes.deleteNote))

export default router;