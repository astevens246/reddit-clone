const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reddit-clone', {useNewUrlParser: true, useUnifiedTopology: true});
const { engine } = require('express-handlebars');

// Import the Post model from models/post.js
const Post = require('./models/post');
const comments = require('./controllers/comments');


const app = express();

// SET UP MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set db
require('./data/reddit-db');

require('./controllers/posts')(app);

require('./controllers/comments.js')(app);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts', async (req, res) => {
    try {
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  });


// NEW
app.get('/cases/new', (req, res) => {
    res.render('cases-new',{});
})

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
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments');
      res.render('post-show', { post });
    } catch (err) {
      console.log(err.message);
    }
  });

// SUBREDDIT
app.get('/n/:subreddit', async (req, res) => {
try {
    const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
    res.render('posts-index', { posts });
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

app.listen(3000);

module.exports = app;