const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user'); 


module.exports = (app) => {
  // CREATE Comment
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      const comment = new Comment(req.body);

      if (req.user) {
        comment.author = req.user._id;
      } else {
        // Handle the case where the user is not authenticated
        console.log('User is not authenticated');
        return res.redirect('/login'); // Redirect to login page
      }

      await comment.save();

      const post = await Post.findById(req.params.postId);
      post.comments.unshift(comment);
      await post.save();

      res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
      console.log(err);
    }
  });
};