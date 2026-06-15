import joi from "joi"


export const SignupValidation = joi.object({
    name: joi.string().trim().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
})

export const idValidation = joi.object({
    id: joi.number().required()
})

export const LoginValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
})


export const PostValidation = joi.object({
    content: joi.string().trim().max(300).min(1).required(),
})

export const LikeValidation = joi.object({
    liked: joi.bool().required()
})
export const CommentValidation = joi.object({
    post_id: joi.number().required(),
    content: joi.string().min(1).max(25).required()
})