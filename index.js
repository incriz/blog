import express from 'express'
import multer from  'multer'

import mongoose from "mongoose";

import {registerValidation, loginValidation, postCreateValidation} from './validations/validation.js'

import checkAuth from "./utils/checkAuth.js";

import * as UserController from './controlles/UserController.js'
import * as PostController from './controlles/PostController.js'
import handleValidationErrors from "./utils/handleValidationErrors.js";


mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.eie1lto.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB err', err))


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads' )
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/auth/login',  loginValidation, handleValidationErrors,  UserController.login)
app.post("/auth/register",  registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth,  upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth,  postCreateValidation, handleValidationErrors,  PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)




// запускаем веб-сервер
app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})