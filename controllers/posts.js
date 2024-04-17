const Post = require('../models/post');

module.exports = (app) => {

  // CREATE
  app.post('/posts/new', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);

    // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
    // Save the post
    post.save()
      .then(() => {
        console.log('Post saved successfully');
        // Redirect to the root
        res.redirect('/');
      })
      .catch(err => {
        console.error('Post save error: ', err);
        // Handle error, for example by sending a response with an error status
        res.status(500).send(err);
      });
  }); // This is the missing closing parenthesis

};