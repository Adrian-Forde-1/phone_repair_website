const util = {
  roles: {
    Owner: 'Owner',
    Admin: 'Admin',
    Customer: 'Customer'
  },

  isUserAllowed: (...roles) => (req, res, next) => {
    if (!req.user) return res.redirect('/404');

    const hasRole = roles.find(role => req.user.role === role);

    if (!hasRole) return res.redirect('/404');

    return next();
  }
};

module.exports = util;
