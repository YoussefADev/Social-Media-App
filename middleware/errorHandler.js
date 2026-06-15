

export function errorHandler(err,req, res, next) {
    console.error(err)

    res.status(err.statusCode || 500).json({
        message: err.message,
        code: err.code || "unknown"
    })
}