import express from "express"
import { validation } from "../middleware/validation.js"
import { idValidation, CommentValidation } from "../validations/validations.js"
import { addComment, getPostComments , deleteComment} from "../controllers/commentsController.js"
import { auth } from "../middleware/auth.js"
export const commentsRouter = express.Router()

commentsRouter.get("/post/:id", validation(idValidation, "params"), auth, getPostComments)
commentsRouter.post("/add", validation(CommentValidation), auth, addComment)
commentsRouter.delete("/delete/:id", validation(idValidation, "params"), auth, deleteComment)