import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { virificationToken } from '../middleware/auth';

const router = Router();

router.get('/', virificationToken, controllerNotes.getAllNotes)
router.get('/:id', virificationToken, controllerNotes.getNote)
router.post('/', virificationToken, controllerNotes.createNote)
router.put('/:id', virificationToken, controllerNotes.updateNote)
router.delete('/:id', virificationToken, controllerNotes.deleteNote)

export default router;