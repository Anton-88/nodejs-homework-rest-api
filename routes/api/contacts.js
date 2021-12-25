import model from '../../model/index'
import { validatePost, validateUpdate } from './validation'
import { Router } from 'express'
const router = new Router()

router.get('/', async (req, res, next) => {
  const contacts = await model.listContacts()
  res.status(200).json(contacts)
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  const contact = await model.getContactById(id)
  console.log(contact)
  if (contact) {
    return res.status(200).json(contact)
  }
  res.status(404).json({ message: 'User not found' })
})

router.post('/', validatePost, async (req, res, next) => {
  const newContact = await model.addContact(req.body)
  res.status(201).json(newContact)
})

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  const contact = await model.removeContact(id)
  if (contact) {
    return res.status(200).json({ message: 'contact successfully deleted' })
  }
  res.status(404).json({ message: 'User not found' })
})

router.patch('/:id', validateUpdate, async (req, res, next) => {
  const { id } = req.params
  const contact = await model.updateContact(id, req.body)
  if (contact) {
    return res.status(200).json(contact)
  }
  res.status(404).json({ message: 'User not found' })
})

export default router
