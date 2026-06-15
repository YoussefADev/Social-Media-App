import multer from "multer";
import path from "path"

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage/avatars")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, req.user_id + ext)
    }
})

const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./storage/posts")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const userId = req.user?.user_id || req.user_id
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`

        cb(null, `${userId}-${unique}${ext}`)
    }
})

const filter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

export const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: filter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

export const postUpload = multer({
    storage: postStorage,
    fileFilter: filter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

// {
//   fieldname: 'avatar',
//   originalname: 'Capture dâ\x80\x99Ã©cran 2025-12-21 205345.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination: './profiles',
//   filename: '6cdb7be7ea00fcf9160e10e62a20585f',
//   path: 'profiles\\6cdb7be7ea00fcf9160e10e62a20585f',
//   size: 240261
// }