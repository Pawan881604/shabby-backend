const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const ErrorHandler = require("../utils/errorhandler");

exports.isAuthenticatedUser = async (req, res, next) => {

  const s_token = req.headers.authorization

  const c_token = s_token && s_token.split(' ')[1];
  
  const { token,tdoken } = req.cookies;


  if (!c_token) {
    return next(new ErrorHandler("Please log in first", 400));
  }
  try {
    const decoded = jwt.verify(c_token, process.env.JWTSECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Handle expired token
      return next(new ErrorHandler("Token expired. Please log in again.", 401));
    } else {
      // Handle other JWT verification errors
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
  }
};

exports.authorizeRols = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
