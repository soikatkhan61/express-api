const jwt = require("jsonwebtoken");
const createError = require('../utils/error');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    next(createError(401, "Access token is required"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    req.user = user;
    next();
  });

};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if ((req.user?.id === req.params?.id) || req.user?.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};