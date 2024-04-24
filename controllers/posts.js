const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {
  // CREATE
  app.post('/posts/new', async (req, res) => {
    if (req.user) {
      const userId = req.user._id;
      const post = new Post(req.body);
      post.author = userId;
      post.upVotes = [];
      post.downVotes = [];
      post.voteScore = 0;

      try {
        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
        // REDIRECT TO THE NEW POST
        return res.redirect(`/posts/${post._id}`);
      } catch (err) {
        console.log(err.message);
        return res.status(400).send({ err });
      }
    }
  });
};