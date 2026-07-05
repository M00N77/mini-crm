import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationAccessToken } from '../middleware/auth';
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/', verificationAccessToken, asyncHandler(contactsController.getContacts))
router.get('/:id', verificationAccessToken, asyncHandler(contactsController.getContactById))
router.post('/', verificationAccessToken, asyncHandler(contactsController.createContact))
router.put('/:id', verificationAccessToken, asyncHandler(contactsController.updateContact))
router.delete('/:id', verificationAccessToken, asyncHandler(contactsController.deleteContact))

export default router;