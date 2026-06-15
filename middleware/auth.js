import jwt from "jsonwebtoken";

export async function auth(req, res, next) {
    let authHeader = req.headers.authorization
    if(!authHeader) return res.sendStatus(401)
    let token = authHeader.split(" ")[1]
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}