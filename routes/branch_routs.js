const express = require("express");
const { isAuthenticatedUser, authorizeRols } = require("../middleware/auth");
const upload = require("../middleware/multer");
const {
  add_branch,
  get_all_branch,
  update_branch,
  get_branch,
} = require("../controllers/branch_controller");
const router = express.Router();

router
  .route("/action-branch")
  .post(isAuthenticatedUser, authorizeRols("admin"), add_branch);

router
  .route("/action-branch/:id")
  .put(isAuthenticatedUser, authorizeRols("admin"), update_branch);

router
  .route("/branch")
  .get(isAuthenticatedUser, authorizeRols("admin"), get_all_branch);

//------------- user
router.route("/branchs").get(get_branch);
module.exports = router;
