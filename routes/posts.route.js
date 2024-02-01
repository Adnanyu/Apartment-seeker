import { Router } from "express";
import { catchAsync } from "../utility/catchAsync.js";
import * as post from "../controllers/posts.js";
import { isLoggedIn, isAuthor, validatePost } from "../middleware.js";
import multer from "multer";
import { storage } from '../cloudinary/index.js'


export const PostRouter = Router()

const upload = multer({ storage })


PostRouter.route('/')
    .get(catchAsync(post.index))
    .post(isLoggedIn, upload.array('image'), validatePost, catchAsync(post.createPost))
    

PostRouter.get('/new', isLoggedIn, post.renderNewForm)

PostRouter.post('/search', post.search)


PostRouter.route('/:id')
    .get(catchAsync(post.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePost, catchAsync(post.editPost))
    .delete(isLoggedIn, isAuthor, catchAsync(post.deletePost))

PostRouter.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(post.editFormPost))




