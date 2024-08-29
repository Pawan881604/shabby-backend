const express = require("express");
const {
  User,
  loginUser,
  logOut,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getSingleUsers,
  getAllUsers,
  updateAdminUserRole,
  deleteAdminUserRole,
  otpVerification,
  reSendOtp,
  forgotPassword,
  changePassword,
  test,
  get_user,
  update_user,
  Login,
  create_admin_user,
  user_password_reset,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRols } = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();

router.route("/authenticate").post(User);
router.route("/login").post(Login);
router
  .route("/edit-admin-user")
  .post(create_admin_user)
  .put(user_password_reset);
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

router.route("/login").post(loginUser);
router.route("/resend-otp").get(reSendOtp);

router.route("/logout").get(logOut);

router.route("/password/reset/:token").put(changePassword);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);

router
  .route("/profile/update")
  .put(isAuthenticatedUser, upload.single("avatar"), updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRols("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRols("admin"), getSingleUsers)
  .put(isAuthenticatedUser, authorizeRols("admin"), updateAdminUserRole)
  .delete(isAuthenticatedUser, authorizeRols("admin"), deleteAdminUserRole);

module.exports = router;
