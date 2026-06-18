import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationToken } from '../middleware/auth';

const router = Router();

router.get('/', verificationToken, controllerNotes.getAllNotes)
router.get('/:id', verificationToken, controllerNotes.getNote)
router.post('/', verificationToken, controllerNotes.createNote)
router.put('/:id', verificationToken, controllerNotes.updateNote)
router.delete('/:id', verificationToken, controllerNotes.deleteNote)

export default router;