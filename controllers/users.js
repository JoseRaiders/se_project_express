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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      user.password = undefined;
      res.status(CREATED).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
        message: "User successfully created",
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "User email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error creating the user" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(BAD_REQUEST)
        .send({ message: "Authentication failed. Invalid email or password" });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name or Avatar must be provided" });
  }

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      delete user.password;
      return res.status(OK).send({ data: user });
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
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error updating user profile" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

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

module.exports = {
  createUser,
  loginUser,
  updateUserProfile,
  getCurrentUser,
};
