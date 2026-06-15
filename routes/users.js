import express from "express"
import { auth } from "../middleware/auth.js"
import { editUserAvatar, deleteUser, getUser} from'../controllers/usersController.js'
import {validation} from "../middleware/validation.js"
import { idValidation}  from "../validations/validations.js"
import { avatarUpload } from "../middleware/upload.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const usersRouter = express.Router()





usersRouter.put("/changeAvatar" , auth, avatarUpload.single("avatar"), asyncHandler(editUserAvatar))
usersRouter.delete("/delete", asyncHandler(deleteUser))
usersRouter.get("/profile/:id", validation(idValidation, "params"), asyncHandler(getUser))

