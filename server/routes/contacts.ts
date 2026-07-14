import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationAccessToken } from '../middleware/auth';
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { createContactSchema, updateContactSchema } from "../schemas/contacts.schema";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationAccessToken, asyncHandler(contactsController.getContactById))
router.post('/', verificationAccessToken, validate(createContactSchema), asyncHandler(contactsController.createContact))
router.put('/:id', verificationAccessToken, validate(updateContactSchema), asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationAccessToken, asyncHandler(contactsController.deleteContact))

export default router;