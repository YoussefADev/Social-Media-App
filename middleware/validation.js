

export const validation = (schema, prop = "body") => (req, res, next) => {
    let {error, value} = schema.validate(req[prop], {stripUnknown: true})

    if (error) {
        return res.status(400).json({errors: error.details.map(e => e.message)})
    }
    req[prop] = value
    next()
}