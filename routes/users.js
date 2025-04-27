const router = require("express").Router();
const {
  getCurrentUser,
  updateUserProfile,
  // createUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUserProfile);

module.exports = router;

// router.get("/", getUsers); --> handled by routes/index.js
// router.get("/:userId", getUser); --> now getCurrentUser handled via /users/me
// router.post("/", createUser); --> handled by routes/index.js via /signup
