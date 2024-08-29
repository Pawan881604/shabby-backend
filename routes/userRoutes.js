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
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRols } = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();

router.route("/authenticate").post(User);

router.route("/login").post(Login);

router
  .route("/edit-admin-user")
  .post(isAuthenticatedUser,authorizeRols("admin"), create_admin_user)
  .post(isAuthenticatedUser,authorizeRols("admin"), create_user)
  .put(isAuthenticatedUser,authorizeRols("admin"),user_password_reset);
  
  router
  .route("/edit-user")
  .post(isAuthenticatedUser,authorizeRols("admin"), create_user)
  
router.route("/profie").get(isAuthenticatedUser, getUserDetails);

router
  .route("/all-users")
  .get(isAuthenticatedUser, authorizeRols("admin"), get_user);

router
  .route("/action-user/:id")
  .put(isAuthenticatedUser, authorizeRols("admin"), update_user);

//----------------------------------------------------
//------------OTP _____________________________________

router.route("/otp").put(otpVerification);

router.route("/resend-otp").get(reSendOtp);



module.exports = router;
