const Item = require("../models/clothingItem");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(OK).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error getting items" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;

  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }

  Item.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(CREATED).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error creating the item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      return res
        .status(OK)
        .send({ message: `${item} Item deleted successfully` });
    })
    .catch((err) => {
      console.error(err);
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(BAD_REQUEST)
        .send({ message: "Error deleting the item" });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res.status(BAD_REQUEST).send({ message: "Error liking the item" });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(BAD_REQUEST)
        .send({ message: "Error unliking the item" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
