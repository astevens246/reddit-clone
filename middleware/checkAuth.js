const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  // Skip the authentication check for the sign-up route
  if (req.path === '/sign-up') {
    return next();
  }

  console.log('Checking authentication');
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

module.exports = checkAuth;