import jwt from "jsonwebtoken"
import {pool} from "../database/pool.js"
import bcrypt from "bcrypt"
import AppError from "../utils/AppError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mapDbError from "../utils/DbErrorMap.js"


export async function signup(req, res) {
    
    try {
        let {name, email, password} = req.body
        let avatar = "default-avatar.png"
        let hashedPassword = await bcrypt.hash(password, 10)
        let [result] = await pool.query("INSERT INTO users (name, email, password, avatar) VALUES(?, ?, ?, ?)", [name, email, hashedPassword, avatar])
        res.status(201).json({
            user_id: result.insertId
        });
    } catch (error) {
        throw mapDbError(error)
    }
}


export async function login(req, res) {
    let {email, password} = req.body

    try{
        let [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email])
        if (rows.length != 0) {
            let user = rows[0]
            if (await bcrypt.compare(password, user.password)) {
                let accessToken = jwt.sign({user_id: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10m"})
                let refreshToken = jwt.sign({user_id: user.id}, process.env.REFRESH_TOKEN_SECRET)

                await pool.query("INSERT INTO refresh_tokens(token, user_id) VALUES(?, ?)", [refreshToken, user.id])

                res.cookie("refresh_token", refreshToken, {httpOnly: true, secure: true, sameSite: "Strict"})
                res.status(200).json({token: accessToken, user: {user_id: rows[0].id, name: rows[0].name, avatar: rows[0].avatar}})
            } else {
                throw new AppError("wrong password", 400, null)
            }
        } else {
            throw new AppError("User not found", 404, null);
            
        }
    } catch(err) {
        throw mapDbError(err)
        console.log(err)
    }
}

export async function logout(req, res) {
    try {
        let refreshToken = req.cookies.refresh_token
        if (!refreshToken) return res.sendStatus(204)
        
        let [result] = await pool.query("DELETE FROM refresh_tokens WHERE token=?", [refreshToken])
        res.clearCookie("refresh_token", {httpOnly: true, secure: true, sameSite: "Strict"})
        if (result.affectedRows != 0) {
            res.sendStatus(200)
        } else {
            throw new AppError("logout failed", 500, null)
        }
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function refresh(req, res) {
    let refreshToken = req.cookies.refresh_token

    if (!refreshToken) return res.sendStatus(401)

    let payload

    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        })

        return res.sendStatus(403)
    }

    let [rows] = await pool.query(
        `SELECT refresh_tokens.user_id, users.name, users.avatar
         FROM refresh_tokens
         JOIN users ON users.id = refresh_tokens.user_id
         WHERE refresh_tokens.token = ?`,
        [refreshToken]
    )

    if (rows.length == 0 || rows[0].user_id != payload.user_id) {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        })

        return res.sendStatus(403)
    }

    let user = rows[0]

    await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken])

    let newRefreshToken = jwt.sign(
        {user_id: user.user_id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    )

    await pool.query(
        "INSERT INTO refresh_tokens(token, user_id) VALUES(?, ?)",
        [newRefreshToken, user.user_id]
    )

    res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    let accessToken = jwt.sign(
        {user_id: user.user_id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "10m"}
    )

    res.status(200).json({
        token: accessToken,
        user: {
            user_id: user.user_id,
            name: user.name,
            avatar: user.avatar
        }
    })
}