import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationToken } from '../middleware/auth';
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/', verificationToken, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationToken, asyncHandler(contactsController.getContactById))
router.post('/', verificationToken, asyncHandler(contactsController.createContact))
router.put('/:id', verificationToken, asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationToken, asyncHandler(contactsController.deleteContact))

export default router;