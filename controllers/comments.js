const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user'); // Add this line

module.exports = function(app) {
  // CREATE Comment
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      const comment = new Comment(req.body);
      comment.author = req.user._id; // Add this line
      await comment.save();
  
      const post = await Post.findById(req.params.postId);
      post.comments.unshift(comment);
      await post.save();
  
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });
};