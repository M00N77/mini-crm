import { Router } from 'express';
import * as contactsController from '../controllers/contacts';
import {getContactById, updateContact} from "../controllers/contacts";
import {deleteContact} from "../services/contacts";

const router = Router();

router.get('/',contactsController.getContacts)
router.get('/:id', contactsController.getContactById)
router.post('/',contactsController.createContact)
router.put('/:id',contactsController.updateContact)
router.delete('/:id',contactsController.deleteContact)

export default router;