import express from "express"
import { auth } from "../middleware/auth.js"
import { postUpload } from "../middleware/upload.js"
import { addPost, deletePost, getPosts , getPost, likePost} from "../controllers/postsController.js"
import { validation } from "../middleware/validation.js"
import { idValidation, LikeValidation, PostValidation } from "../validations/validations.js"
import { asyncHandler } from "../utils/asyncHandler.js"
export const postsRouter = express.Router()

postsRouter.post("/add", auth, validation(PostValidation), postUpload.single("image"), asyncHandler(addPost))
postsRouter.delete("/delete/:id", auth, validation(idValidation, "params"), asyncHandler(deletePost))
postsRouter.get("/", auth, asyncHandler(getPosts))
postsRouter.get("/:id", validation(idValidation, "params"), asyncHandler(getPost))
postsRouter.post("/:id/like", auth, validation(idValidation, "params"), validation(LikeValidation), asyncHandler(likePost))