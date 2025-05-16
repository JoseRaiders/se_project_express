const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

module.exports = router;
