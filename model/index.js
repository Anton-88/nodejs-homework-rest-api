import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { fileURLToPath } from 'url'
import contacts from './contacts.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const listContacts = async () => {
  return contacts
}

const getContactById = async (contactId) => {
  const [contact] = contacts.filter((contact) => contact.id === contactId)
  return contact
}

const removeContact = async (contactId) => {
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId)
  if (contactIndex <= -1) {
    return null
  }
  const [result] = contacts.splice(contactIndex, 1)
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2))
  return result
}

const addContact = async ({ name, email, phone }) => {
  const newContact = { id: randomUUID(), name, email, phone }
  contacts.push(newContact)
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contactIndex = contacts.findIndex((contact) => contact.id !== contactId)
  if (contactIndex <= -1) {
    return null
  }
  const updContact = { id: contactId, ...contacts[contactIndex], ...body }
  contacts[contactIndex] = updContact
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2))
  return updContact
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
