const express = require("express");
const {
  User,

  getUserDetails,
  otpVerification,
  reSendOtp,
  get_user,
  update_user,
  Login,
  create_admin_user,
  user_password_reset,
  create_user,
  update_admin_user,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRols } = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();

//-----------------admin

router
  .route("/edit-admin-user")
  .post(isAuthenticatedUser, authorizeRols("admin","manager"), create_admin_user)
  .put(isAuthenticatedUser, authorizeRols("admin","manager"), user_password_reset);

router
  .route("/edit-admin-user/:id")
  .put(isAuthenticatedUser, authorizeRols("admin","manager"), update_admin_user);

router
  .route("/edit-user")
  .post(isAuthenticatedUser, authorizeRols("admin","manager"), create_user);

router
  .route("/action-user/:id")
  .put(isAuthenticatedUser, authorizeRols("admin","manager"), update_user);

router
  .route("/all-users")
  .get(isAuthenticatedUser, authorizeRols("admin","manager"), get_user);

//-----------------users
router.route("/authenticate").post(User);
router.route("/login").post(Login);
router.route("/profie").get(isAuthenticatedUser, getUserDetails);

//----------------------------------------------------
//------------OTP _____________________________________

router.route("/otp").put(otpVerification);

router.route("/resend-otp").get(reSendOtp);

module.exports = router;
