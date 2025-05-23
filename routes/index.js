const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

// authentication
router.post("/signin", loginUser);
router.post("/signup", createUser);

// user and clothingitem
router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ error: "Route not found" });
});

module.exports = router;
