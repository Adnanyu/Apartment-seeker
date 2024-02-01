import { Router } from "express";
import { catchAsync } from "../utility/catchAsync.js";
import { storeReturnTo } from "../middleware.js";
import { isLoggedIn } from "../middleware.js";
import { storageProfile } from "../cloudinary/index.js";
import multer from "multer";
import * as user from "../controllers/users.js";

import passport from "passport";

const upload = multer({ storage: storageProfile })

export const userRouter = Router()

userRouter.route('/register')
    .get(user.renderRegister)
    .post(upload.single('image'), catchAsync(user.registerUser))

userRouter.get('/logout', user.logoutUser); 

userRouter.get('/users/:id', catchAsync(user.getUser));

userRouter.post('/save/:id', isLoggedIn, catchAsync(user.save));

userRouter.get('/saved', isLoggedIn, catchAsync(user.getSavedPosts));

userRouter.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);