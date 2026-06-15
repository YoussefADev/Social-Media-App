import express from "express"
import {login, refresh, logout, signup} from'../controllers/authController.js'
import {validation} from "../middleware/validation.js"
import {auth} from "../middleware/auth.js"
import {LoginValidation, SignupValidation}  from "../validations/validations.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const authRouter = express.Router()

authRouter.post("/login", validation(LoginValidation), asyncHandler(login))
authRouter.post("/sign-up", validation(SignupValidation), asyncHandler(signup))
authRouter.post("/logout", auth, asyncHandler(logout))
authRouter.get("/refresh", refresh)