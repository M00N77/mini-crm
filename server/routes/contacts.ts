import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationAccessToken } from '../middleware/auth';
import { validateUser } from '../middleware/validateUser';
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateId } from "../middleware/validateId";
import { createContactSchema, updateContactSchema } from "../schemas/contacts.schema";

const router = Router();

router.get('/', verificationAccessToken, validateUser, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(contactsController.getContactById))
router.post('/', verificationAccessToken, validateUser, validate(createContactSchema), asyncHandler(contactsController.createContact))
router.put('/:id', verificationAccessToken, validateUser, validateId, validate(updateContactSchema), asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationAccessToken, validateUser, validateId, asyncHandler(contactsController.deleteContact))

export default router;