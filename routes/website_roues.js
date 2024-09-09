const express = require("express");
const { isAuthenticatedUser, authorizeRols } = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  add_website,
  update_website,
  get_all_websites,
  get_app_websites,
} = require("../controllers/website_controller");
const router = express.Router();

router
  .route("/action-websites")
  .post(
    isAuthenticatedUser,
    authorizeRols("admin", "Manager"),
    upload.single("image"),
    add_website
  );

router
  .route("/action-website/:id")
  .put(
    isAuthenticatedUser,
    authorizeRols("admin", "Manager"),
    upload.single("image"),
    update_website
  );

router
  .route("/websites")
  .get(
    isAuthenticatedUser,
    authorizeRols("admin", "Manager"),
    get_all_websites
  );

router.route("/app-websites").get(isAuthenticatedUser,get_app_websites);
module.exports = router;
