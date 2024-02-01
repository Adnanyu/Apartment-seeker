import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import methodOveride from 'method-override';
import { ExpressError } from './utility/expressError.js';
import engine from 'ejs-mate';
import { PostRouter } from './routes/posts.route.js';
import { userRouter } from './routes/user.route.js';
import { ChatRouter } from './routes/chat.route.js';
import { messageRouter } from './routes/message.route.js';
import { User } from './models/user.js';
import { createServer } from 'node:http';
import { getIo } from './socket/socket.js';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
dotenv.config();

const atlasUrl = process.env.ATLAS_URI 
mongoose
  .connect(`${atlasUrl}`)
  .then(() => {
    console.log('mongoo connection is open!!');
  })
  .catch((err) => {
    console.log('there is errooo!!!');
    console.log(err);
  });

const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const io = getIo(server);

app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOveride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.isLoading = true;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/posts', PostRouter);
app.use('/', userRouter);
app.use('/chats', ChatRouter);
app.use('/messages', messageRouter);

app.get('/fakeuser', async (res, req) => {
  const user = new User({ email: 'adnan', username: 'adil' });
  const newuser = await User.register(user, 'adnan');
  res.send(newuser);
});

app.get('/', (req, res) => {
  res.render('home');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  console.log(err);
  if (!err.message) err.message = 'oh no, something went wrong11';
  console.log(err.message);
  res.status(statusCode).render('error', { err });
});

app.all('*', (req, res, next) => {
    res.render('notFound')
    // next(new ExpressError('page not found', 404))
})
server.listen('3000', () => {
  console.log('listening on port 3000');
});
