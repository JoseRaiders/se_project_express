const router = require("express").Router();
const {
  getCurrentUser,
  // getUsers,
  // createUser,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

router.get("/me", getCurrentUser);

module.exports = router;
