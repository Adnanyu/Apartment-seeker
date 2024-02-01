import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime.js'
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()
dayjs.extend(relativeTime);

export const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    const posts = await Post.find({ author: id }).populate('author')
  
    const joinedDate = dayjs(user.createdAt).fromNow()
    res.render('posts/userPosts',{user, posts, joinedDate})
}

export const renderRegister = (req, res) => {
    res.render('users/register')
}

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body
    const recaptchaToken = req.body['g-recaptcha-response'];
    if (!recaptchaToken) {
        req.flash('error', 'reCAPTCHA verification must be completed')
        res.redirect('/register')
    }
    try {

        const secretKey = process.env.RECAPTCHA_SECRET;
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        const response = await axios.post(verificationURL);
        const { success } = response.data;
        if (success) {
            const user = new User({ email, username })
            if (req.file) {
                user.profile_picture = req.file.path
            }
            const registerUser = await User.register(user, password)
            req.login(registerUser, err => {
                if (err) return next(err)
                console.log(registerUser)
                req.flash('success', 'welcome to Apartment-seeker')
                res.redirect('/posts')
            })
        }else {
            // reCAPTCHA verification failed
            req.flash('error', 'reCAPTCHA verification failed')
            res.redirect('/register')
        }
    } catch (e) {
        console.error('Error verifying reCAPTCHA:', error);
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

export const logoutUser = (req, res, next) => {
    req.logout( (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/posts');
    });
}

export const renderLogin = (req, res) => {
    res.render('users/login') 
}

export const login = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/posts';
    const { username } = req.user;
    req.flash('success', `Welcome back, ${username}!`)
    delete res.locals.returnTo
    res.redirect(redirectUrl)
}

export const bookMark = (req, res) => {
    res.render('posts/new')
}
  
export const save = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const post = await Post.findById(id);
    const currentUser = await User.findById(user._id);
    if (currentUser.saved.includes(post._id)) {
        currentUser.saved = currentUser.saved.filter(
        (postId) => postId.toString() !== post._id.toString()
        );
        await currentUser.save();
        req.flash('success', 'You successfully unsaved the post')
        return res.redirect(`/posts/${id}`)
    }
    currentUser.saved.push(post._id);
    await currentUser.save();
    req.flash('success', 'You successfully saved the post')
    res.redirect(`/posts/${id}`)
};

export const getSavedPosts = async (req, res) => {
    const { user } = req;
    const currentUser = await User.findById(user._id).populate('saved');
    res.render('posts/saved', {posts: currentUser.saved})
};


