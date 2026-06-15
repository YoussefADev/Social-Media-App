
import express from "express";
import path from "path"
import morgan from "morgan";
import { usersRouter } from "./routes/users.js"
import { authRouter } from "./routes/auth.js";
import { commentsRouter } from "./routes/comments.js"
import cookieParser from "cookie-parser";
import multer from "multer";
import { avatarUpload } from "./middleware/upload.js"
import { errorHandler } from "./middleware/errorHandler.js";
import { postsRouter } from "./routes/posts.js";
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use("/avatars", express.static("storage/avatars"))
app.use("/posts", express.static("storage/posts"))
app.use(express.static("views"))

app.use("/api/users", usersRouter)
app.use("/api/posts", postsRouter)
app.use("/api/comments", commentsRouter)
app.use("/api/auth", authRouter)

app.use(errorHandler)

app.use((req, res) => {
    res.sendFile(path.resolve("views/index.html"))
})



app.listen(1000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("server is listening on port 1000")
})