const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  // UNAUTHORIZED_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash })) // direct return without block
    .then(() => {
      return res.status(CREATED).send({
        message: "User successfully created",
        user: { name, avatar, email },
      });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "User with this email already exists" });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return next(err);
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) =>
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      })
    )
    .catch((err) =>
      res.status(BAD_REQUEST).send({
        message: `${err.message}. Authentication failed. Invalid email or password`,
      })
    );
};

const updateUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name or Avatar must be provided" });
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }

      const responseUser = user.toObject();
      delete responseUser.password;
      return res.status(OK).send({ data: responseUser });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data format for name or avatar" });
      }

      return next(err);
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
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

module.exports = {
  createUser,
  loginUser,
  updateUserProfile,
  getCurrentUser,
};
