import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes.schema";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(controllerNotes.getAllNotes))
router.get('/:id', verificationAccessToken, asyncHandler(controllerNotes.getNote))
router.post('/', verificationAccessToken, validate(createNoteSchema), asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationAccessToken, validate(updateNoteSchema), asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, asyncHandler(controllerNotes.deleteNote))

export default router;