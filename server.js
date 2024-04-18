const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');

// Import the Post model from models/post.js
const Post = require('./models/post');
const Comment = require('./models/comment'); // Add this line
const comments = require('./controllers/comments');

const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');

const app = express();

// SET UP MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(checkAuth);

// Set db
require('dotenv').config();
require('./data/reddit-db');

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// ROUTES
// INDEX
app.get('/', async (req, res) => {
  const { user } = req;
  console.log(req.cookies);
  try {
    const posts = await Post.find({}).lean().populate('author');
    res.render('posts-index', { posts, user });
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/posts', async (req, res) => {
  try {
    const currentUser = req.user; // Add this line
    const posts = await Post.find({}).lean();
    return res.render('posts-index', { posts, currentUser });
  } catch (err) {
    console.log(err.message);
  }
});

// POSTS
app.get('/posts/new', (req, res) => {
  res.render('posts-new',{});
})

app.post('/posts', (req, res) => {
  const post = new Post(req.body);
  post.save()
    .then((post) => {
      res.redirect('/');
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// LOOK UP THE POST
app.get('/posts/:id', async (req, res) => {
  const currentUser = req.user;

  try {
    const post = await Post.findById(req.params.id).lean().populate({ path:'comments', populate: { path: 'author' } }).populate('author');
    res.render('posts-show', { post, currentUser });
  } catch (err) {
    console.log(err.message);
  }
});

// SUBREDDIT
app.get('/n/:subreddit', async (req, res) => {
  const currentUser = req.user;
  const { subreddit } = req.params;

  try {
    const posts = await Post.find({ subreddit }).lean().populate('author');
    res.render('posts-index', { posts, currentUser });
  } catch (err) {
    console.log(err);
  }
});

// CREATE Comment
app.post('/posts/:postId/comments', (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const comment = new Comment(req.body);

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    // REDIRECT TO THE ROOT
    .then(() => res.redirect('/'))
    .catch((err) => {
    console.log(err);
    });
});

// LOGOUT
app.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  res.redirect('/');
});

app.listen(3000);

module.exports = app;