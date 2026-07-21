import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes.schema";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(controllerNotes.getNotes))
router.get('/:id', verificationAccessToken, validateId, asyncHandler(controllerNotes.getNoteById))
router.post('/', verificationAccessToken, validate(createNoteSchema), asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationAccessToken, validateId, validate(updateNoteSchema), asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, validateId, asyncHandler(controllerNotes.deleteNote))

export default router;