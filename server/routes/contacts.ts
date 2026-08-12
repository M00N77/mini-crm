import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createContactSchema, updateContactSchema } from "../schemas/contacts.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contacts management
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve a list of contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: A list of contacts.
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     responses:
 *       201:
 *         description: Contact created successfully.
 */

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact found.
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact updated successfully.
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted successfully.
 */

router.get('/', verificationAccessToken, validateUser, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(contactsController.getContactById))
router.post('/', verificationAccessToken, validateUser, validate(createContactSchema), asyncHandler(contactsController.createContact))
router.put('/:id', verificationAccessToken, validateUser, validateId, validate(updateContactSchema), asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(contactsController.deleteContact))

export default router;