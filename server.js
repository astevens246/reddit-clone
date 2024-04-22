const express = require('express');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

// ... rest of your code ...

const handlebarsInstance = expressHandlebars.create({
  handlebars: require('handlebars'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
});
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
require('./controllers/replies.js')(app);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// ROUTES

// INDEX
app.get('/', async (req, res) => {
  const currentUser = req.user;

  try {
    const posts = await Post.find({}).populate('author');
    res.render('posts-index', { posts, currentUser });
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/posts', async (req, res) => {
  try {
    const currentUser = req.user; // Add this line
    const posts = await Post.find({}).lean().populate('author');
    return res.render('posts-index', { posts, currentUser });
  } catch (err) {
    console.log(err.message);
  }
});

// POSTS
// CREATE


app.post('/posts/new', async (req, res) => {
  console.log(req.body);
  if (req.user) {
    const post = new Post({
      title: req.body.title,
      url: req.body.url,
      summary: req.body.summary,
      subreddit: req.body.subreddit, 
      author: req.user._id
    });

    try {
      await post.save();
      res.redirect('/');
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    return res.status(401); // UNAUTHORIZED
  }
});

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
app.get('/posts/:id', (req, res) => {
  const currentUser = req.user;
  Post.findById(req.params.id).populate('comments').lean()
    .then((post) => res.render('posts-show', { post, currentUser }))
    .catch((err) => {
      console.log(err.message);
    });
});

// SUBREDDIT
app.get('/n/:subreddit', (req, res) => {
  const { user } = req;
  Post.find({ subreddit: req.params.subreddit }).lean()
    .then((posts) => res.render('posts-index', { posts, user }))
    .catch((err) => {
      console.log(err);
    });
});

// CREATE Comment
app.post('/posts/:postId/comments', async (req, res) => {
  // INSTANTIATE INSTANCE OF MODEL
  const comment = new Comment(req.body);
  comment.author = req.user._id;

  try {
    // SAVE INSTANCE OF Comment MODEL TO DB
    await comment.save();

    // Find the post with the id provided in the url
    const post = await Post.findById(req.params.postId);

    // Associate the comment with the post
    post.comments.unshift(comment._id);

    console.log(post);

    // Save the post
    await post.save();

    // REDIRECT TO THE POST
    res.redirect(`/posts/${req.params.postId}`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// LOGOUT
app.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  res.redirect('/');
});

app.listen(3000);

module.exports = app;