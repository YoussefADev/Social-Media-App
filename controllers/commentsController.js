import { pool } from "../database/pool.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);


export const getPostComments = asyncHandler(async(req, res) => {
    let {id} = req.params

    let [rows] = await pool.query("SELECT comments.*,users.name, users.avatar FROM comments JOIN users ON comments.user_id=users.id WHERE post_id=?", [id])
    
    res.status(200).json(rows.map(comment => {
        comment.timeFromNow = dayjs(comment.created_at).fromNow()
        return comment
    }))
})

export const addComment = asyncHandler(async(req, res) => {
    let {post_id, content} = req.body
    let {user_id} = req.user
    
    let [result] = await pool.query("INSERT INTO comments(user_id, post_id, content) VALUES(?, ?, ?)", [user_id, post_id, content])

    if (result.affectedRows == 0) {
        throw new AppError("creating comment failed", 500, null); 
    } else {
        res.status(201).json({id: result.insertId})
    }
})

export const deleteComment = asyncHandler(async(req, res) => {

})