import Joi from 'joi'

const postSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
})

const updateSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
}).or('name', 'email', 'phone')


export const validatePost = async (req, res, next) => {
    try {
        const val = await postSchema.validateAsync(req.body)
        console.log(val)
    } catch (err) {
        return res.status(400).json({ message: `missing ${err.message.replace(/"/g, "'")} field!` })
    }
    next()
}

export const validateUpdate = async (req, res, next) => {
    try {
        const val = await updateSchema.validateAsync(req.body)
        console.log(val)
    } catch (err) {
        return res.status(400).json({ message: 'missing fields' })
    }
    next()
}