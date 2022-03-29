function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function authRole(permissions) {
  return (req, res, next) => {
    const userRole = req.user.role_id;
    if (permissions.includes(userRole)) {
      next();
    } else {
      return res.status(403).json('YOU DONT HAVE PERMISSION!');
    }
  };
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  authRole,
};
