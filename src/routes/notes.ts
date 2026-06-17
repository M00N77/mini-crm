import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import {createNote, getAllNotes} from "../controllers/notes";

const router = Router();

router.get('/',controllerNotes.getAllNotes)
router.get('/:id',controllerNotes.getNote)
router.post('/',controllerNotes.createNote)
router.put('/:id',controllerNotes.updateNote)
router.delete('/:id',controllerNotes.deleteNote)

export default router;