const User = require("../models/user");

const getUsers = (req, res) => {
  // console.log("IN CONTROLLER");
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error getting users" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error fetching the user" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      console.log(err);
      return res.status(500).send({ message: "Error creating the user" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
