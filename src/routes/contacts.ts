import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import { virificationToken } from '../middleware/auth';

const router = Router();

router.get('/', virificationToken, contactsController.getContacts)
router.get('/:id', virificationToken, contactsController.getContactById)
router.post('/', virificationToken, contactsController.createContact)
router.put('/:id', virificationToken, contactsController.updateContact)
router.delete('/:id', virificationToken, contactsController.deleteContact)

export default router;