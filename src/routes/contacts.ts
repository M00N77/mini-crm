import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { verificationToken } from '../middleware/auth';

const router = Router();

router.get('/', verificationToken, contactsController.getContacts)
router.get('/:id', verificationToken, contactsController.getContactById)
router.post('/', verificationToken, contactsController.createContact)
router.put('/:id', verificationToken, contactsController.updateContact)
router.delete('/:id', verificationToken, contactsController.deleteContact)

export default router;