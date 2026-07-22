import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes.schema";

const router = Router();

router.get('/', verificationAccessToken, validateUser, asyncHandler(controllerNotes.getNotes))
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(controllerNotes.getNoteById))
router.post('/', verificationAccessToken, validateUser, validate(createNoteSchema), asyncHandler(controllerNotes.createNote))
router.put('/:id', verificationAccessToken, validateUser, validateId, validate(updateNoteSchema), asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(controllerNotes.deleteNote))

export default router;