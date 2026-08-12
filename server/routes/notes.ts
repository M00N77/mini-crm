import { Router } from 'express';
import * as controllerNotes from '../controllers/notes';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve a list of notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: A list of notes.
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     responses:
 *       201:
 *         description: Note created successfully.
 */

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note found.
 *   put:
 *     summary: Update a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note updated successfully.
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 */

router.get('/', verificationAccessToken, validateUser, asyncHandler(controllerNotes.getNotes))
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(controllerNotes.getNoteById))
router.post('/', verificationAccessToken, validateUser, validate(createNoteSchema), asyncHandler(controllerNotes.createNote))
router.patch('/:id', verificationAccessToken, validateUser, validateId, validate(updateNoteSchema), asyncHandler(controllerNotes.updateNote))
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(controllerNotes.deleteNote))

export default router;