const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = role;
