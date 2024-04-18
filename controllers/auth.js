const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = app => {
  
  // SIGN UP GET
  app.get('/sign-up', (req, res) => {
    res.render('sign-up');
  });

// SIGN UP POST
app.post('/sign-up', async (req, res) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create User with hashed password
  const user = new User({
    username: req.body.username,
    password: hashedPassword
  });

  user
    .save()
    .then(() => {
      return res.redirect('/login'); // Redirect to login page after sign up
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).send({ err });
    });
});

// LOGIN GET
app.get('/login', (req, res) => {
  res.render('login');
});

// LOGIN POST
app.post('/login', async (req, res) => {
  // Authenticate User
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send({ err: 'Invalid username or password' });
  }

  const isMatch = req.body.password && await bcrypt.compare(req.body.password, user.password);

  if (isMatch) {
    // Create JWT and set as cookie
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
    return res.redirect('/');
  } else {
    return res.status(400).send({ err: 'Invalid username or password' });
  }
});
  
};