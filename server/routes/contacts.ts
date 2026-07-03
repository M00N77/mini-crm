import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationAccessToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/', verificationAccessToken, rateLimit, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationAccessToken, rateLimit, asyncHandler(contactsController.getContactById))
router.post('/', verificationAccessToken, rateLimit, asyncHandler(contactsController.createContact))
router.put('/:id', verificationAccessToken, rateLimit, asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationAccessToken, rateLimit, asyncHandler(contactsController.deleteContact))

export default router;