const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error getting users" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(BAD_REQUEST).send({ message: "User ID is required" });
  }

  return User.findById(userId)
    .then((user) =>
      user
        ? res.status(OK).send({ data: user })
        : res.status(NOT_FOUND).send({ message: "User not found" })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error fetching the user" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  return User.create({ name, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid input format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error creating the user" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
