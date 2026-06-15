
import { pool } from "../database/pool.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mapDbError from "../utils/DbErrorMap.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);


export async function addPost(req, res) {
    try {
        let {content} = req.body
        let image = req.file?.filename || "default-post.png"
        let user_id = req.user.user_id

        let [result] = await pool.query(
            "INSERT INTO posts(user_id, content, image) VALUES(?, ?, ?)",
            [user_id, content, image]
        )

        if (result.affectedRows == 0) {
            throw new AppError("creating post failed", 500, null);
        }

        res.status(201).json({
            id: result.insertId,
            content,
            image,
            user_id,
            timeFromNow: "0 minute ago"
        })
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function  deletePost(req, res) {
    try {
        let {id} = req.params
        let [result] = await pool.query(
            "DELETE FROM posts WHERE id=? and user_id=?",
            [id, req.user.user_id]
        )

        if (result.affectedRows == 0) {
            throw new AppError("post not found", 404, "NOT_FOUND");
        }

        res.status(200).json({postId: id})
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function getPost(req, res) {
    try {
        let {id} = req.params
        let [rows] = await pool.query("SELECT * FROM posts WHERE id=?", [id])

        if (rows.length == 0) {
            throw new AppError("post not found", 404, "NOT_FOUND");
        }

        let post = rows[0]
        post.timeFromNow = dayjs(post.created_at).fromNow()

        res.status(200).json(post)
    } catch (error) {
        throw mapDbError(error)
    }
}
 
export async function getPosts(req, res) {
    try {
        let ownerId = Number(req.query.owner) || null
        let page = Math.max(Number(req.query.page) || 1, 1)
        let limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50)
        let offset = (page - 1) * limit

        let [rows] = await pool.query(
            `SELECT 
                posts.*,
                users.name,
                users.avatar,
                COUNT(likes_all.user_id) AS likesCount,
                CASE WHEN likes_me.user_id IS NULL THEN false ELSE true END AS isLikedByMe
            FROM posts
            JOIN users ON users.id = posts.user_id
            LEFT JOIN likes AS likes_all ON likes_all.post_id = posts.id
            LEFT JOIN likes AS likes_me 
                ON likes_me.post_id = posts.id 
                AND likes_me.user_id = ? ${(ownerId != null) ? `where posts.user_id=?` : ''}
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
            LIMIT ? OFFSET ?`,
            (ownerId != null) ? [req.user.user_id, ownerId, limit, offset] : [req.user.user_id, limit, offset]
        )

        res.status(200).json({
            page,
            limit,
            posts: rows.map(post => {
                post.timeFromNow = dayjs(post.created_at).fromNow()
                return post
            })
        })
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function likePost(req, res) {
    try {
        let {id} = req.params
        let userId = req.user.user_id
        let {liked} = req.body

        let query = liked
            ? "INSERT IGNORE INTO likes(user_id, post_id) VALUES(?, ?)"
            : "DELETE FROM likes WHERE user_id=? and post_id=?"
        let [result] = await pool.query(query, [userId, id])

        res.sendStatus(201)
    } catch (error) {
        throw mapDbError(error)
    }
}
