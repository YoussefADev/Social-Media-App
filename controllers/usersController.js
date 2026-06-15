import {pool} from "../database/pool.js"
import AppError from "../utils/AppError.js"
import mapDbError from "../utils/DbErrorMap.js"




export async function editUserAvatar(req, res) {
    try {
        let id = req.user.user_id
        let avatar = req.file.filename

        let [result] = await pool.query("UPDATE users SET avatar=? WHERE id=?", [avatar, id])

        if(result.affectedRows != 0) {
            res.status(200).json({
                message: "Avatar updated successfully",
                avatar
            });
        } else {
            throw new AppError("user not found", 404, "NOT_FOUND");
        }
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function deleteUser(req, res) {
    try {
        let id = req.user.user_id

        let [result] = await pool.query("DELETE FROM users WHERE id=?", [id])

        if(result.affectedRows != 0) {
            res.status(200).json({id: id})
        } else {
            throw new AppError("user not found", 404, "NOT_FOUND");
        }
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function getUser(req, res) {
    try {
        let {id} = req.params

        let [rows] = await pool.query(
            `SELECT 
                users.name,
                users.email,
                users.avatar,
                (SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id) AS postsCount,
                (SELECT COUNT(*) FROM comments WHERE comments.user_id = users.id) AS commentsCount,
                (SELECT COUNT(*) FROM likes WHERE likes.user_id = users.id) AS likesCount
            FROM users
            WHERE users.id=?`,
            [id]
        )

        if(rows.length != 0) {
            res.status(200).json({user: rows[0]})
        } else {
            throw new AppError("user not found", 404, "NOT_FOUND");
        }
    } catch (error) {
        throw mapDbError(error)
    }
}

