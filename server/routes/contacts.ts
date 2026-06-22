import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/', verificationToken, rateLimit, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationToken, rateLimit, asyncHandler(contactsController.getContactById))
router.post('/', verificationToken, rateLimit, asyncHandler(contactsController.createContact))
router.put('/:id', verificationToken, rateLimit, asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationToken, rateLimit, asyncHandler(contactsController.deleteContact))

export default router;