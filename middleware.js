import { Post } from "./models/post.js";
import { postSchema } from "./schemas.js";
import { ExpressError } from "./utility/expressError.js";



export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

export const validatePost = (req, res, next) => {
    
    const { error } = postSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join (',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

export const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'you dont have permission!!')
        return res.redirect(`/posts/${id}`)
    }
    next()
}

