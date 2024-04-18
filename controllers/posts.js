const Post = require('../models/post');

module.exports = (app) => {

  // CREATE
  app.post('/posts/new', async (req, res) => {
    if (req.user) {
      try {
        const post = new Post(req.body);
        await post.save();
        console.log('Post saved successfully');
        res.redirect('/');
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });
};