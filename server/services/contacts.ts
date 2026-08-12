import {paginate} from "../utils/paginate";
import { AppError } from "../utils/AppError";
import { ContactDto } from "../mappers/contact.mapper";
import * as contactsRepository from '../repositories/contacts.repository';

export async function getContacts(userId: number,pageInput: number, limitInput: number) {

    const paginationData = await paginate('contacts',pageInput,limitInput,'user_id',userId)
    const {offset, limit, ...pagination} = paginationData
    const rows = await contactsRepository.findContacts(userId, offset, limit);

    return {
        "data": rows.map((row: any) => new ContactDto(row)),
        "pagination": pagination
    };
}

export async function getContactById(userId:number,id: number) {
    const row = await contactsRepository.findContactById(userId, id);
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}
export async function createContact(userId : number,name:string,email:string,company:string,jobPosition:string,phone:string) {
    const row = await contactsRepository.createContact(userId, name, email, company, jobPosition, phone);
    return new ContactDto(row);
}

export async function updateContact(userId:number,id:number,fields:{name:string,email:string,company:string,jobPosition:string,phone:string}) {
    const row = await contactsRepository.updateContact(userId, id, fields);
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}

export async function deleteContact(userId:number,id:number) {
    const row = await contactsRepository.deleteContact(userId, id);
    if (!row) throw new AppError("Contact not found", 404);
    return new ContactDto(row);
}