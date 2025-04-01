const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error getting items" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl, userId } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  Item.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      console.log(err);
      return res.status(500).send({ message: "Error creating the item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res
          .status(404)
          .send({ message: "Requested resource not found" });
      }
      return res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Error deleting the item" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};
